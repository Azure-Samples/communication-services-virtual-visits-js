// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createRoomAndRedirectUrl } from './CreateRoom';
import * as CreateRoom from './FetchRoomsResponse';
import { CreateRoomResponse } from '../models/RoomModel';

const mockCreateRoomResponse = {
  roomId: 'roomId',
  participants: [
    {
      id: 'presenterId',
      role: 'Presenter'
    },
    {
      id: 'attendeeId',
      role: 'Attendee'
    }
  ]
} as CreateRoomResponse;

describe('CreateRoomAndRedirectUrl', () => {
  it('returns rooms url with userId and roomId', async () => {
    const createRoomSpy = jest.spyOn(CreateRoom, 'createRoom');
    createRoomSpy.mockImplementation(
      async (): Promise<CreateRoomResponse> => {
        return mockCreateRoomResponse;
      }
    );
    const mockUserRole = 'Presenter';
    const mockRedirectUrl = '/visit?roomId=roomId&userId=presenterId';
    const redirectUrl = await createRoomAndRedirectUrl(mockUserRole);

    expect(redirectUrl).toEqual(mockRedirectUrl);
  });

  it('throws error if response status code is not 201', async () => {
    const createRoomSpy = jest.spyOn(CreateRoom, 'createRoom');
    createRoomSpy.mockImplementation(
      async (): Promise<CreateRoomResponse> => {
        throw new Error('test error');
      }
    );

    const mockUserRole = 'userRole';

    try {
      await createRoomAndRedirectUrl(mockUserRole);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
