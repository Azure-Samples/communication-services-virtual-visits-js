// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import createError from 'http-errors';
import { JoinRoomResponse } from '../models/RoomModel';

export async function fetchRoomsResponse(roomId: string, userId: string): Promise<JoinRoomResponse> {
  const response = await fetch('/api/rooms/token', {
    method: 'POST',
    body: JSON.stringify({
      roomId: roomId,
      userId: userId
    }),
    headers: {
      'content-type': 'application/json;charset=UTF-8'
    }
  });

  if (response.status !== 200) {
    throw new createError(
      response.status,
      `Unable to retrieve user token. Status: ${response.status}. Message: ${response.statusText}.`
    );
  }

  const responseContent = await response.text();
  const roomResponse = JSON.parse(responseContent);

  return roomResponse;
}
