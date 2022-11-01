// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import express from 'express';
import { CommunicationIdentityClient } from '@azure/communication-identity';
import { RoomsClient } from '@azure/communication-rooms';
import { createTestAppointment } from '../controllers/createTestAppointment';
import { joinTestAppointment } from '../controllers/joinTestAppointment';

export const testAppointmentRouter = (
  identityClient: CommunicationIdentityClient,
  roomsClient: RoomsClient
): express.Router => {
  // Initialize router
  const router = express.Router();

  router.post('/', createTestAppointment(identityClient, roomsClient));
  router.get('/join', joinTestAppointment(identityClient, roomsClient));

  return router;
};
