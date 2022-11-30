// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationUserToken } from '@azure/communication-identity';
import { RoomCallLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { Spinner } from '@fluentui/react';
import { mount } from 'enzyme';
import { Header } from './Header';
import { Visit } from './Visit';
import { GenericError } from './components/GenericError';
import { JoinTeamsMeeting } from './components/JoinTeamsMeeting';
import { TeamsMeetingExperience } from './components/teams/TeamsMeetingExperience';
import { AppConfigModel } from './models/ConfigModel';
import * as FetchConfig from './utils/FetchConfig';
import * as FetchToken from './utils/FetchToken';
import * as FetchRoomsResponse from './utils/FetchRoomsResponse';
import * as GetMeetingLink from './utils/GetMeetingLink';
import { generateTheme } from './utils/ThemeGenerator';
import {
  createMockCallAdapter,
  createMockCallComposite,
  createMockCallWithChatAdapter,
  createMockCallWithChatComposite,
  createMockStatefulCallClient,
  createMockStatefulChatClient,
  runFakeTimers
} from './utils/TestUtils';
import { JoinRoomResponse, RoomParticipantRole } from './models/RoomModel';
import { RoomsMeetingExperience } from './components/rooms/RoomsMeetingExperience';

jest.mock('@azure/communication-react', () => {
  return {
    ...jest.requireActual('@azure/communication-react'),
    createAzureCommunicationCallWithChatAdapterFromClients: () => createMockCallWithChatAdapter(),
    createAzureCommunicationCallAdapterFromClient: () => createMockCallAdapter(),
    createStatefulCallClient: () => createMockStatefulCallClient(),
    createStatefulChatClient: () => createMockStatefulChatClient(),
    CallWithChatComposite: () => createMockCallWithChatComposite(),
    CallComposite: () => createMockCallComposite()
  };
});

jest.mock('@azure/communication-common', () => {
  return {
    AzureCommunicationTokenCredential: function () {
      return { token: '', getToken: () => '' };
    }
  };
});

describe('Visit with teams link', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.spyOn(console, 'error').mockImplementation();

    const fetchTokenSpy = jest.spyOn(FetchToken, 'fetchToken');
    fetchTokenSpy.mockReturnValue(
      Promise.resolve({
        user: { communicationUserId: 'userId' },
        token: 'token',
        expiresOn: new Date()
      } as CommunicationUserToken)
    );

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
  });

  it('should render loading spinner when config is not loaded', async () => {
    const fetchConfigSpy = jest.spyOn(FetchConfig, 'fetchConfig');
    fetchConfigSpy.mockReturnValue(Promise.resolve(undefined));

    const visit = mount(<Visit />);

    await runFakeTimers();

    visit.update();

    const spinners = visit.find(Spinner);
    const headers = visit.find(Header);

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

    const visit = mount(<Visit />);

    await runFakeTimers();

    visit.update();

    const spinners = visit.find(Spinner);
    const genericErrors = visit.find(GenericError);

    expect(spinners.length).toBe(0);
    expect(genericErrors.length).toBe(1);
  });

  it('renders a generic error when token throws an error', async () => {
    const fetchTokenSpy = jest.spyOn(FetchToken, 'fetchToken');
    fetchTokenSpy.mockImplementation(
      async (): Promise<CommunicationUserToken> => {
        throw new Error('test error');
      }
    );

    const getChatThreadIdFromTeamsLinkSpy = jest.spyOn(GetMeetingLink, 'getChatThreadIdFromTeamsLink');
    getChatThreadIdFromTeamsLinkSpy.mockReturnValue('threadId');

    const getTeamsMeetingLink = jest.spyOn(GetMeetingLink, 'getTeamsMeetingLink');
    getTeamsMeetingLink.mockImplementation(() => {
      return {
        meetingLink:
          '?meetingURL=https%3A%2F%2Fteams.microsoft.com%2Fl%2Fmeetup-join%2F19%253ameeting_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2540thread.v2%2F0%3Fcontext%3D%257b%2522Tid%2522%253a%252200000000-0000-0000-0000-000000000000%2522%252c%2522Oid%2522%253a%252200000000-0000-0000-0000-000000000000%2522%257d'
      } as TeamsMeetingLinkLocator;
    });

    const visit = mount(<Visit />);

    await runFakeTimers();

    visit.update();

    const spinners = visit.find(Spinner);
    const genericErrors = visit.find(GenericError);

    expect(spinners.length).toBe(0);
    expect(genericErrors.length).toBe(1);
  });

  it('should render JoinTeamsMeeting when config is loaded and meeting link is not set', async () => {
    const visit = mount(<Visit />);

    await runFakeTimers();

    visit.update();

    const spinners = visit.find(Spinner);
    const joinMeetings = visit.find(JoinTeamsMeeting);

    expect(spinners.length).toBe(0);
    expect(joinMeetings.length).toBe(1);
  });

  it('should render MeetingExperience when config and token are loaded and meeting link is set', async () => {
    const getChatThreadIdFromTeamsLinkSpy = jest.spyOn(GetMeetingLink, 'getChatThreadIdFromTeamsLink');
    getChatThreadIdFromTeamsLinkSpy.mockReturnValue('threadId');

    const getTeamsMeetingLink = jest.spyOn(GetMeetingLink, 'getTeamsMeetingLink');
    getTeamsMeetingLink.mockImplementation(() => {
      return {
        meetingLink:
          '?meetingURL=https%3A%2F%2Fteams.microsoft.com%2Fl%2Fmeetup-join%2F19%253ameeting_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2540thread.v2%2F0%3Fcontext%3D%257b%2522Tid%2522%253a%252200000000-0000-0000-0000-000000000000%2522%252c%2522Oid%2522%253a%252200000000-0000-0000-0000-000000000000%2522%257d'
      } as TeamsMeetingLinkLocator;
    });

    const visit = mount(<Visit />);

    await runFakeTimers();

    visit.update();

    const spinners = visit.find(Spinner);
    const meetingExperience = visit.find(TeamsMeetingExperience);

    expect(spinners.length).toBe(0);
    expect(meetingExperience.length).toBe(1);
  });
});

describe('Visit with rooms link', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.spyOn(console, 'error').mockImplementation();

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
          id: 'mockParticipantId',
          role: RoomParticipantRole.presenter
        },
        token: 'token'
      })
    );

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

    const getRoomsMeetingLinkSpy = jest.spyOn(GetMeetingLink, 'getRoomsMeetingLink');
    getRoomsMeetingLinkSpy.mockImplementation(() => {
      return {
        roomId: 'mockRoomId'
      } as RoomCallLocator;
    });

    const getRoomsUserIdSpy = jest.spyOn(GetMeetingLink, 'getRoomsUserId');
    getRoomsUserIdSpy.mockReturnValue('mockParticipantId');
  });

  it('renders a generic error when rooms token throws an error', async () => {
    const fetchRoomsResponseSpy = jest.spyOn(FetchRoomsResponse, 'fetchRoomsResponse');
    fetchRoomsResponseSpy.mockImplementation(
      async (): Promise<JoinRoomResponse> => {
        throw new Error('test error');
      }
    );

    const visit = mount(<Visit />);

    await runFakeTimers();

    visit.update();

    const spinners = visit.find(Spinner);
    const genericErrors = visit.find(GenericError);

    expect(spinners.length).toBe(0);
    expect(genericErrors.length).toBe(1);
  });

  it('should render RoomsMeetingExperience when config, token, roomsResponse are loaded and rooms meeting link is set', async () => {
    const getTeamsMeetingLink = jest.spyOn(GetMeetingLink, 'getTeamsMeetingLink');
    getTeamsMeetingLink.mockImplementation(() => {
      throw new Error('test error');
    });

    const visit = mount(<Visit />);

    await runFakeTimers();

    visit.update();

    const spinners = visit.find(Spinner);
    const meetingExperience = visit.find(TeamsMeetingExperience);
    const roomsMeetingExperience = visit.find(RoomsMeetingExperience);

    expect(spinners.length).toBe(0);
    expect(meetingExperience.length).toBe(0);
    expect(roomsMeetingExperience.length).toBe(1);
  });
});
