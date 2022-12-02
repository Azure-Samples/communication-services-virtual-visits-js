// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as FetchRoomsResponse from '../../utils/FetchRoomsResponse';
import { JoinRoomResponse, RoomParticipantRole } from '../../models/RoomModel';
import { RoomsMeeting } from './RoomsMeeting';
import { mount } from 'enzyme';
import {
  createMockCallAdapter,
  createMockCallComposite,
  createMockStatefulCallClient,
  runFakeTimers
} from '../../utils/TestUtils';
import { Spinner } from '@fluentui/react';
import { RoomsMeetingExperience } from './RoomsMeetingExperience';

jest.mock('@azure/communication-react', () => {
  return {
    ...jest.requireActual('@azure/communication-react'),
    createAzureCommunicationCallAdapterFromClient: () => createMockCallAdapter(),
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

    const roomsMeeting = mount(
      <RoomsMeeting locator={roomCallLocator} participantId={'mockParticipantId'} onDisplayError={jest.fn()} />
    );

    await runFakeTimers();

    roomsMeeting.update();
    expect(roomsMeeting.props().onDisplayError).toHaveBeenCalled();
  });

  it('should render loading spinner when token is not loaded', async () => {
    const fetchRoomsResponseSpy = jest.spyOn(FetchRoomsResponse, 'fetchRoomsResponse');
    fetchRoomsResponseSpy.mockReturnValue(Promise.resolve(undefined));

    const roomsMeeting = mount(
      <RoomsMeeting locator={roomCallLocator} participantId={'mockParticipantId'} onDisplayError={jest.fn()} />
    );

    await runFakeTimers();

    roomsMeeting.update();

    const spinners = roomsMeeting.find(Spinner);
    const roomsMeetingExperience = roomsMeeting.find(RoomsMeetingExperience);

    expect(spinners.length).toBe(1);
    expect(roomsMeetingExperience.length).toBe(0);
  });

  it('should render RoomsMeetingExperience when rooms response is loaded', async () => {
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
    const roomsMeeting = mount(
      <RoomsMeeting locator={roomCallLocator} participantId={'mockParticipantId'} onDisplayError={jest.fn()} />
    );

    await runFakeTimers();

    roomsMeeting.update();
    const spinners = roomsMeeting.find(Spinner);
    const roomsMeetingExperience = roomsMeeting.find(RoomsMeetingExperience);
    expect(spinners.length).toBe(0);
    expect(roomsMeetingExperience.length).toBe(1);
  });
});
