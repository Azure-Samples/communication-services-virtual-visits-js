// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { render } from '@testing-library/react';
import { JoinRoomResponse, RoomParticipantRole } from '../../models/RoomModel';
import * as FetchRoomsResponse from '../../utils/FetchRoomsResponse';
import {
  createMockCallAdapter,
  createMockCallComposite,
  createMockStatefulCallClient,
  runFakeTimers
} from '../../utils/TestUtils';
import { generateTheme } from '../../utils/ThemeGenerator';
import { RoomsMeeting } from './RoomsMeeting';

jest.mock('@azure/communication-react', () => {
  return {
    ...jest.requireActual('@azure/communication-react'),
    createAzureCommunicationCallAdapterFromClient: () => createMockCallAdapter(),
    useAzureCommunicationCallAdapter: () => createMockCallAdapter(),
    createStatefulCallClient: () => createMockStatefulCallClient(),
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

describe('RoomsMeeting', () => {
  const roomCallLocator = {
    roomId: 'mockRoomId'
  };
  const mockConfig = {
    communicationEndpoint: 'endpoint=test_endpoint;',
    microsoftBookingsUrl: '',
    chatEnabled: true,
    screenShareEnabled: true,
    companyName: '',
    theme: generateTheme('#FFFFFF'),
    waitingTitle: '',
    waitingSubtitle: '',
    logoUrl: ''
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.spyOn(console, 'error').mockImplementation();
  });

  it('should call onDisplayError callback if unable to fetch rooms response', async () => {
    const fetchRoomsResponseSpy = jest.spyOn(FetchRoomsResponse, 'fetchRoomsResponse');
    fetchRoomsResponseSpy.mockImplementation(
      async (): Promise<JoinRoomResponse> => {
        throw new Error('test error');
      }
    );

    const testFn = jest.fn();

    render(
      <RoomsMeeting
        config={mockConfig}
        locator={roomCallLocator}
        participantId={'mockParticipantId'}
        onDisplayError={testFn}
      />
    );

    await runFakeTimers();

    expect(testFn).toHaveBeenCalled();
  });

  it('should render loading spinner when token is not loaded', async () => {
    const fetchRoomsResponseSpy = jest.spyOn(FetchRoomsResponse, 'fetchRoomsResponse');
    fetchRoomsResponseSpy.mockReturnValue(Promise.resolve(undefined));

    const roomsMeeting = render(
      <RoomsMeeting
        config={mockConfig}
        locator={roomCallLocator}
        participantId={'mockParticipantId'}
        onDisplayError={jest.fn()}
      />
    );

    await runFakeTimers();

    const spinners = roomsMeeting.queryAllByTestId('spinner');
    const roomsMeetingExperience = roomsMeeting.queryAllByTestId('rooms-composite');

    expect(spinners.length).toBe(1);
    expect(roomsMeetingExperience.length).toBe(0);
  });

  it('should render RoomsMeetingExperience with invite link when rooms response is loaded for presenter', async () => {
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
    const roomsMeeting = render(
      <RoomsMeeting
        config={mockConfig}
        locator={roomCallLocator}
        participantId={'mockPresenterId'}
        onDisplayError={jest.fn()}
      />
    );

    await runFakeTimers();

    const spinners = roomsMeeting.queryAllByTestId('spinner');
    const roomsMeetingExperience = roomsMeeting.queryAllByTestId('rooms-composite');
    expect(spinners.length).toBe(0);
    expect(roomsMeetingExperience.length).toBe(1);
  });

  it('should render RoomsMeetingExperience without invite link when rooms response is loaded for attendee', async () => {
    const fetchRoomsResponseSpy = jest.spyOn(FetchRoomsResponse, 'fetchRoomsResponse');
    fetchRoomsResponseSpy.mockReturnValue(
      Promise.resolve({
        participant: {
          id: 'mockAttendeeId',
          role: RoomParticipantRole.attendee
        },
        token: 'token'
      })
    );
    const roomsMeeting = render(
      <RoomsMeeting
        config={mockConfig}
        locator={roomCallLocator}
        participantId={'mockAttendeeId'}
        onDisplayError={jest.fn()}
      />
    );

    await runFakeTimers();

    const spinners = roomsMeeting.queryAllByTestId('spinner');
    const roomsMeetingExperience = roomsMeeting.queryAllByTestId('rooms-composite');
    expect(spinners.length).toBe(0);
    expect(roomsMeetingExperience.length).toBe(1);
  });
});
