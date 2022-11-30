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

export interface JoinRoomResponse {
  participant: RoomParticipant;
  token: string;
}

export interface CreateRoomResponse {
  roomId: string;
  participants: Array<RoomParticipant>;
}
