// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as express from 'express';
import { getTranscriptionManager } from '../utils/callAutomationUtils';

const router = express.Router();

interface UpdateParticipantsRequest {
  serverCallId: string;
  participant: {
    communicationUserId: string;
    displayName: string;
  };
}

router.post('/', async function (req, res, next) {
  const { serverCallId, participant }: UpdateParticipantsRequest = req.body;

  console.log('Updating participants for call:', serverCallId);

  try {
    await getTranscriptionManager().storeParticipantInCall(serverCallId, participant);
  } catch (e) {
    console.error('Error updating participants:', e);
    res.status(500).send('Error updating participants');
    return;
  }

  res.status(200).end();
});

export default router;
