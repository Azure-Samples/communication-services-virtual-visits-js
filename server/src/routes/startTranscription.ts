// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as express from 'express';
import { getTranscriptionManager, startTranscriptionForCall } from '../utils/callAutomationUtils';
import { TranscriptionOptions } from '@azure/communication-call-automation/types/communication-call-automation';
import { sendEventToClients } from '../app';

const router = express.Router();
interface StartTranscriptionRequest {
  serverCallId: string;
  options?: TranscriptionOptions;
}

router.post('/', async function (req, res, next) {
  const { serverCallId, options }: StartTranscriptionRequest = req.body;

  console.log('Starting transcription for call:', serverCallId);
  const callConnectionId = getTranscriptionManager().getCallConnectionIDFromServerCallId(serverCallId);

  if (!callConnectionId) {
    res.status(404).send('Call not found');
    return;
  }

  try {
    await startTranscriptionForCall(callConnectionId, options);
  } catch (e) {
    console.error('Error starting transcription:', e);
    res.status(500).send('Error starting transcription');
    return;
  }

  res.status(200).end();

  // Send SSE event to clients
  sendEventToClients('TranscriptionStarted', { serverCallId });
});

export default router;
