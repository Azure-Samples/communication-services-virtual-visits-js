// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as FetchRoomsResponse from '../../utils/FetchRoomsResponse';
import { JoinRoomResponse } from '../../models/RoomModel';
import { RoomsMeeting } from './RoomsMeeting';
import { mount } from 'enzyme';
import { runFakeTimers } from '../../utils/TestUtils';

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
});
