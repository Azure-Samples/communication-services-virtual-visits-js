// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { RoomCallLocator } from '@azure/communication-calling';

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
  token: string;
  participant: RoomParticipant;
  invitee?: RoomParticipant;
}

export interface CreateRoomResponse {
  roomId: string;
  participants: Array<RoomParticipant>;
}

export interface RoomsInfo {
  userId: string;
  userRole: RoomParticipantRole;
  locator: RoomCallLocator;
  inviteParticipantUrl?: string;
}
