// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import createError from 'http-errors';
import { CreateRoomResponse, JoinRoomResponse } from '../models/RoomModel';

export const fetchRoomsResponse = async (roomId: string, userId: string): Promise<JoinRoomResponse | undefined> => {
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
};

export const createRoom = async (): Promise<CreateRoomResponse> => {
  const response = await fetch('/api/rooms', {
    method: 'POST',
    headers: {
      'content-type': 'application/json;charset=UTF-8'
    }
  });
  if (response.status !== 201) {
    throw new createError(
      response.status,
      `Unable to create room. Status: ${response.status}. Message: ${response.statusText}.`
    );
  }
  const responseContent = await response.text();
  const roomsResponse = JSON.parse(responseContent);
  return roomsResponse;
};
