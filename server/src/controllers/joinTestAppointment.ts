// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import express from 'express';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { CommunicationAccessToken, CommunicationIdentityClient, TokenScope } from '@azure/communication-identity';
import { RoomsClient, RoomParticipant } from '@azure/communication-rooms';
import { JoinTestAppointmentResponse, RoomParticipantRole } from '../models/testAppointmentModel';
import { ERROR_NO_USER_FOUND_IN_ROOM } from '../constants';

export const joinTestAppointment = (identityClient: CommunicationIdentityClient, roomsClient: RoomsClient) => async (
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
