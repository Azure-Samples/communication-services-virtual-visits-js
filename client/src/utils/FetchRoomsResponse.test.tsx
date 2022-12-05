// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { JoinRoomResponse, RoomParticipantRole } from '../models/RoomModel';
import { fetchRoomsResponse } from './FetchRoomsResponse';

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
});
