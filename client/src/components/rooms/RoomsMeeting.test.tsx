// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as FetchRoomsResponse from '../../utils/FetchRoomsResponse';
import { JoinRoomResponse } from '../../models/RoomModel';
import { RoomsMeeting } from './RoomsMeeting';
import { mount } from 'enzyme';
import { runFakeTimers } from '../../utils/TestUtils';
import { Spinner } from '@fluentui/react';

describe('RoomsMeeting', () => {
  const roomCallLocator = {
    roomId: 'mockRoomId'
  };
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

    expect(spinners.length).toBe(1);
  });
});
