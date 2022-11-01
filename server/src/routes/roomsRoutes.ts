// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import express from 'express';
import { CommunicationIdentityClient } from '@azure/communication-identity';
import { RoomsClient } from '@azure/communication-rooms';
import { createRoom, joinRoom } from '../controllers/roomsController';

export const roomsRouter = (identityClient: CommunicationIdentityClient, roomsClient: RoomsClient): express.Router => {
  // Initialize router
  const router = express.Router();

  router.post('/', createRoom(identityClient, roomsClient));
  router.get('/join', joinRoom(identityClient, roomsClient));

  return router;
};
