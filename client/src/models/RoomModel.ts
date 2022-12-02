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
  participant: RoomParticipant;
  token: string;
}

export interface RoomsInfo {
  userId: string;
  userRole: RoomParticipantRole;
  locator: RoomCallLocator;
}
