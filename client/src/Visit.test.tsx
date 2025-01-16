// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { RoomCallLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { Visit } from './Visit';
import { AppConfigModel } from './models/ConfigModel';
import * as FetchConfig from './utils/FetchConfig';
import * as FetchRoomsResponse from './utils/FetchRoomsResponse';
import * as GetMeetingLink from './utils/GetMeetingLink';
import { generateTheme } from './utils/ThemeGenerator';
import * as FetchToken from './utils/FetchToken';
import {
  createMockCallAdapter,
  createMockCallComposite,
  createMockCallWithChatAdapter,
  createMockCallWithChatComposite,
  createMockStatefulCallClient,
  createMockStatefulChatClient,
  runFakeTimers
} from './utils/TestUtils';
import { CommunicationUserToken } from '@azure/communication-identity';
import { RoomParticipantRole } from './models/RoomModel';
import { render } from '@testing-library/react';

jest.mock('@azure/communication-react', () => {
  return {
    ...jest.requireActual('@azure/communication-react'),
    createAzureCommunicationCallWithChatAdapterFromClients: () => createMockCallWithChatAdapter(),
    useAzureCommunicationCallWithChatAdapter: () => createMockCallWithChatAdapter(),
    useAzureCommunicationCallAdapter: () => createMockCallAdapter(),
    createStatefulCallClient: () => createMockStatefulCallClient(),
    createStatefulChatClient: () => createMockStatefulChatClient(),
    CallWithChatComposite: () => createMockCallWithChatComposite(),
    CallComposite: () => createMockCallComposite()
  };
});

jest.mock('@azure/communication-common', () => {
  return {
    ...jest.requireActual('@azure/communication-common'),
    AzureCommunicationTokenCredential: function () {
      return { token: '', getToken: () => '' };
    }
  };
});

describe('Visit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.spyOn(console, 'error').mockImplementation();

    const fetchConfigSpy = jest.spyOn(FetchConfig, 'fetchConfig');
    fetchConfigSpy.mockReturnValue(
      Promise.resolve({
        communicationEndpoint: 'endpoint=test_endpoint;',
        microsoftBookingsUrl: '',
        chatEnabled: true,
        screenShareEnabled: true,
        companyName: '',
        theme: generateTheme('#FFFFFF'),
        waitingTitle: '',
        waitingSubtitle: '',
        logoUrl: ''
      } as AppConfigModel)
    );

    const fetchTokenSpy = jest.spyOn(FetchToken, 'fetchToken');
    fetchTokenSpy.mockReturnValue(
      Promise.resolve({
        user: { communicationUserId: 'userId' },
        token: 'token',
        expiresOn: new Date()
      } as CommunicationUserToken)
    );

    const fetchRoomsResponseSpy = jest.spyOn(FetchRoomsResponse, 'fetchRoomsResponse');
    fetchRoomsResponseSpy.mockReturnValue(
      Promise.resolve({
        participant: {
          id: 'mockPresenterId',
          role: RoomParticipantRole.presenter
        },
        invitee: {
          id: 'mockAttendeeId',
          role: RoomParticipantRole.attendee
        },
        token: 'token'
      })
    );
  });

  it('should render loading spinner when config is not loaded', async () => {
    const fetchConfigSpy = jest.spyOn(FetchConfig, 'fetchConfig');
    fetchConfigSpy.mockReturnValue(Promise.resolve(undefined));

    const visit = render(<Visit />);

    await runFakeTimers();

    const spinners = visit.queryAllByTestId('spinner');
    const headers = visit.queryAllByTestId('header');

    expect(spinners.length).toBe(1);
    expect(headers.length).toBe(0);
  });

  it('renders a generic error when config throws an error', async () => {
    const fetchConfigSpy = jest.spyOn(FetchConfig, 'fetchConfig');
    fetchConfigSpy.mockImplementation(
      async (): Promise<AppConfigModel | undefined> => {
        throw new Error('test error');
      }
    );

    const visit = render(<Visit />);

    await runFakeTimers();

    const spinners = visit.queryAllByTestId('spinner');
    const genericErrors = visit.queryAllByTestId('generic-error');

    expect(spinners.length).toBe(0);
    expect(genericErrors.length).toBe(1);
  });

  it('should render JoinTeamsMeeting when config is loaded and meeting link is not set', async () => {
    const visit = render(<Visit />);

    await runFakeTimers();

    const spinners = visit.queryAllByTestId('spinner');
    const joinMeeting = visit.getAllByText('Join a call');
    const roomsMeeting = visit.queryAllByTestId('rooms-composite');
    const teamsMeeting = visit.queryAllByTestId('meeting-composite');

    expect(spinners.length).toBe(0);
    expect(joinMeeting.length).toBe(1);
    expect(roomsMeeting.length).toBe(0);
    expect(teamsMeeting.length).toBe(0);
  });

  it('should render TeamsMeeting when config is loaded and meeting link is a teams meeting link', async () => {
    const getChatThreadIdFromTeamsLinkSpy = jest.spyOn(GetMeetingLink, 'getChatThreadIdFromTeamsLink');
    getChatThreadIdFromTeamsLinkSpy.mockReturnValue('threadId');

    const getTeamsMeetingLink = jest.spyOn(GetMeetingLink, 'getTeamsMeetingLink');
    getTeamsMeetingLink.mockImplementation(() => {
      return {
        meetingLink:
          '?meetingURL=https%3A%2F%2Fteams.microsoft.com%2Fl%2Fmeetup-join%2F19%253ameeting_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2540thread.v2%2F0%3Fcontext%3D%257b%2522Tid%2522%253a%252200000000-0000-0000-0000-000000000000%2522%252c%2522Oid%2522%253a%252200000000-0000-0000-0000-000000000000%2522%257d'
      } as TeamsMeetingLinkLocator;
    });
    const visit = render(<Visit />);

    await runFakeTimers();

    const spinners = visit.queryAllByTestId('spinner');
    const joinMeeting = visit.queryAllByText('Join a call');
    const roomsMeeting = visit.queryAllByTestId('rooms-composite');
    const teamsMeeting = visit.queryAllByTestId('meeting-composite');

    expect(spinners.length).toBe(0);
    expect(joinMeeting.length).toBe(0);
    expect(roomsMeeting.length).toBe(0);
    expect(teamsMeeting.length).toBe(1);
  });

  it('should render RoomsMeeting when config is loaded and meeting link is rooms meeting link', async () => {
    const getTeamsMeetingLink = jest.spyOn(GetMeetingLink, 'getTeamsMeetingLink');
    getTeamsMeetingLink.mockImplementation(() => {
      throw new Error('test error');
    });

    const getRoomCallLocatorSpy = jest.spyOn(GetMeetingLink, 'getRoomCallLocator');
    getRoomCallLocatorSpy.mockImplementation(() => {
      return {
        roomId: 'mockRoomId'
      } as RoomCallLocator;
    });

    const getRoomsUserIdSpy = jest.spyOn(GetMeetingLink, 'getRoomsUserId');
    getRoomsUserIdSpy.mockReturnValue('mockParticipantId');

    const visit = render(<Visit />);

    await runFakeTimers();

    const spinners = visit.queryAllByTestId('spinner');
    const joinMeeting = visit.queryAllByTestId('join-meeting');
    const roomsMeeting = visit.queryAllByTestId('rooms-composite');
    const teamsMeeting = visit.queryAllByTestId('meeting-composite');

    expect(spinners.length).toBe(0);
    expect(joinMeeting.length).toBe(0);
    expect(teamsMeeting.length).toBe(0);
    expect(roomsMeeting.length).toBe(1);
  });
});
