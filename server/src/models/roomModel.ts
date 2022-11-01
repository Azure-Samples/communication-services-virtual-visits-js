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

export interface CreateTestAppointmentResponse {
  roomId: string;
  participants: Array<RoomParticipant>;
}

export interface JoinTestAppointmentResponse {
  participant: RoomParticipant;
  token: string;
}
