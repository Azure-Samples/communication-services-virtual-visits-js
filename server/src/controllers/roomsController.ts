// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import express from 'express';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { CommunicationAccessToken, CommunicationIdentityClient, TokenScope } from '@azure/communication-identity';
import { Room, RoomsClient, RoomParticipant, CreateRoomOptions } from '@azure/communication-rooms';
import {
  CreateTestAppointmentResponse,
  JoinTestAppointmentResponse,
  RoomParticipantRole,
  RoomParticipant as TestAppointmentRoomParticipant
} from '../models/testAppointmentModel';
import { ERROR_NO_USER_FOUND_IN_ROOM } from '../constants';

export const createRoom = (identityClient: CommunicationIdentityClient, roomsClient: RoomsClient) => async (
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

export const joinRoom = (identityClient: CommunicationIdentityClient, roomsClient: RoomsClient) => async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<any> => {
  try {
    const { roomId, userId } = req.query;

    // Retrieve participants list
    const participantsList = await roomsClient.getParticipants(roomId as string);

    // Check if the user is part of participants
    const foundUserParticipant: RoomParticipant | undefined = participantsList.find(
      (participant: RoomParticipant) => (participant.id as CommunicationUserIdentifier).communicationUserId === userId
    );

    if (foundUserParticipant) {
      // Create token
      const scopes: TokenScope[] = ['voip'];
      const user: CommunicationUserIdentifier = {
        communicationUserId: userId as string
      };

      const tokenResponse: CommunicationAccessToken = await identityClient.getToken(user, scopes);

      // Formulating response
      const response: JoinTestAppointmentResponse = {
        participant: {
          id: (foundUserParticipant.id as CommunicationUserIdentifier).communicationUserId,
          role: foundUserParticipant.role as RoomParticipantRole
        },
        token: tokenResponse.token
      };

      return res.send(response);
    }

    return res.status(400).send(ERROR_NO_USER_FOUND_IN_ROOM);
  } catch (error) {
    return next(error);
  }
};
