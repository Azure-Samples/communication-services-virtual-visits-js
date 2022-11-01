// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import express from 'express';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { Room, RoomsClient, RoomParticipant, CreateRoomOptions } from '@azure/communication-rooms';
import { CommunicationIdentityClient } from '@azure/communication-identity';
import {
  CreateTestAppointmentResponse,
  RoomParticipantRole,
  RoomParticipant as TestAppointmentRoomParticipant
} from '../models/testAppointmentModel';

export const createTestAppointment = (identityClient: CommunicationIdentityClient, roomsClient: RoomsClient) => async (
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<any> => {
  try {
    const presenter = await identityClient.createUser();
    const attendee = await identityClient.createUser();

    // Options payload to create a room
    const createRoomOptions: CreateRoomOptions = {
      participants: [
        {
          id: presenter,
          role: RoomParticipantRole.presenter
        },
        {
          id: attendee,
          role: RoomParticipantRole.attendee
        }
      ]
    };

    // Create a room with the request payload
    const createdRoom: Room = await roomsClient.createRoom(createRoomOptions);

    // Formulating participants
    const participants = createdRoom.participants.map(
      (participant: RoomParticipant): TestAppointmentRoomParticipant => ({
        id: (participant.id as CommunicationUserIdentifier).communicationUserId as string,
        role: participant.role as RoomParticipantRole
      })
    );

    // Formulate response
    const response: CreateTestAppointmentResponse = {
      roomId: createdRoom.id,
      participants: participants
    };

    return res.send(response);
  } catch (error) {
    return next(error);
  }
};
