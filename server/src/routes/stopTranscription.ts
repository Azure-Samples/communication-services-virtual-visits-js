// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as express from 'express';
import { getTranscriptionManager, stopTranscriptionForCall } from '../utils/callAutomationUtils';
import { sendEventToClients } from '../app';

const router = express.Router();
interface StartTranscriptionRequest {
  serverCallId: string;
}

router.post('/', async function (req, res, next) {
  const { serverCallId }: StartTranscriptionRequest = req.body;

  const callConnectionId = getTranscriptionManager().getCallConnectionIDFromServerCallId(serverCallId);
  if (!callConnectionId) {
    res.status(404).send('Call not found');
    return;
  }

  try {
    await stopTranscriptionForCall(callConnectionId);
  } catch (e) {
    console.error('Error stopping transcription:', e);
    res.status(500).send('Error stopping transcription');
    return;
  }

  res.status(200).end();
  sendEventToClients('TranscriptionStopped', { serverCallId });
});

export default router;
