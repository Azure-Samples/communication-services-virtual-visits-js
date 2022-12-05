// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { JoinRoomResponse, RoomParticipantRole, CreateRoomResponse } from '../models/RoomModel';
import { fetchRoomsResponse, createRoom } from './FetchRoomsResponse';

let fetchBackup: any = undefined;

beforeEach(() => {
  fetchBackup = global.fetch;
});

afterEach(() => {
  global.fetch = fetchBackup;
});

describe('FetchRoomsToken', () => {
  it('should fetch rooms response and return it', async () => {
    const mockRoomsResponse: JoinRoomResponse = {
      participant: {
        id: 'mockPresenterId',
        role: RoomParticipantRole.presenter
      },
      token: 'mockToken'
    };

    global.fetch = jest.fn(
      (_: RequestInfo | URL, __?: RequestInit | undefined): Promise<Response> => {
        return Promise.resolve<Response>({
          status: 200,
          text: () => Promise.resolve(JSON.stringify(mockRoomsResponse))
        } as Response);
      }
    );
    const roomsResponse = await fetchRoomsResponse('roomId', 'mockParticipantId');
    expect(roomsResponse).toStrictEqual(mockRoomsResponse);
  });

  it('should call createRoom and return response', async () => {
    const mockCreateRoomResponse: CreateRoomResponse = {
      roomId: 'mockRoomId',
      participants: [
        {
          id: 'mockParticipantId',
          role: RoomParticipantRole.presenter
        },
        {
          id: 'mockParticipantId',
          role: RoomParticipantRole.attendee
        }
      ]
    };

    global.fetch = jest.fn(
      (_: RequestInfo | URL, __?: RequestInit | undefined): Promise<Response> => {
        return Promise.resolve<Response>({
          status: 201,
          text: () => Promise.resolve(JSON.stringify(mockCreateRoomResponse))
        } as Response);
      }
    );
    const roomsResponse = await createRoom();
    expect(roomsResponse).toStrictEqual(mockCreateRoomResponse);
  });
});
