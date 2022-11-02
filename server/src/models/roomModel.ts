// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export enum RoomParticipantRole {
  presenter = 'Presenter',
  attendee = 'Attendee',
  consumer = 'Consumer'
}

export interface RoomParticipant {
  id: string;
  role: RoomParticipantRole;
}

export interface CreateRoomResponse {
  roomId: string;
  participants: Array<RoomParticipant>;
}

export interface JoinRoomRequest {
  roomId: string;
  userId: string;
}

export interface JoinRoomResponse {
  participant: RoomParticipant;
  token: string;
}
