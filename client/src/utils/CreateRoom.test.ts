// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createRoomAndRedirectUrl } from './CreateRoom';
import * as CreateRoom from './FetchRoomsResponse';
import { CreateRoomResponse, RoomParticipant, RoomParticipantRole } from '../models/RoomModel';

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
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.spyOn(console, 'log').mockImplementation();
  });

  it('returns rooms url with userId and roomId', async () => {
    jest.spyOn(CreateRoom, 'createRoom').mockImplementation(
      async (): Promise<CreateRoomResponse> => {
        return mockCreateRoomResponse;
      }
    );

    const mockRedirectUrl = '/visit?roomId=roomId&userId=presenterId';
    const redirectUrl = await createRoomAndRedirectUrl();

    expect(redirectUrl).toEqual(mockRedirectUrl);
  });

  it('throws error if createRoom fails', async () => {
    jest.spyOn(CreateRoom, 'createRoom').mockImplementation(
      async (): Promise<CreateRoomResponse> => {
        throw new Error('test error');
      }
    );

    try {
      await createRoomAndRedirectUrl();
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it.each([
    [[]],
    [[{ id: '123', role: RoomParticipantRole.attendee }]],
    [[{ id: '123', role: RoomParticipantRole.consumer }]]
  ])(
    'throws error if no userId with Presenter role is present in the room created',
    async (participants: RoomParticipant[]) => {
      jest.spyOn(CreateRoom, 'createRoom').mockImplementation(
        async (): Promise<CreateRoomResponse> => {
          return { roomId: 'roomId', participants: participants } as CreateRoomResponse;
        }
      );

      try {
        await createRoomAndRedirectUrl();
      } catch (err) {
        expect(err).toBeDefined();
        expect((err as Error).message).toBe('room does not have participant with role Presenter');
      }
    }
  );
});
