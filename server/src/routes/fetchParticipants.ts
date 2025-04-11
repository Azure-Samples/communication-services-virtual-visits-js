// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as express from 'express';
import { getTranscriptionManager } from '../utils/callAutomationUtils';

const router = express.Router();

interface FetchParticipantsRequest {
  serverCallId: string;
}

interface FetchParticipantsResponse {
  participants: Array<{
    communicationUserId: string;
    displayName: string;
  }>;
}

router.post('/', async function (req, res, next) {
  const { serverCallId }: FetchParticipantsRequest = req.body;

  const participantsFromCall = getTranscriptionManager().getParticipantsInCall(serverCallId);
  if (!participantsFromCall) {
    res.status(404).send('participants not found');
    return;
  }
  const participants: FetchParticipantsResponse = {
    participants: participantsFromCall
  };

  res.status(200).send(participants);
});

export default router;
