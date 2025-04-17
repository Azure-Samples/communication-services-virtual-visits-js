// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as express from 'express';
import { getTranscriptionManager } from '../utils/callAutomationUtils';
import { TranscriptionData } from '@azure/communication-call-automation';

const router = express.Router();
interface FetchTranscriptRequest {
  serverCallId: string;
}
interface FetchTranscriptResponse {
  transcript: TranscriptionData[];
}

router.post('/', async function (req, res, next) {
  const { serverCallId }: FetchTranscriptRequest = req.body;
  /**
   * callId here is the correlationId in the Automation event saying transcription has started
   * we need to use this to get the call connectionId from the callAutomation client
   */
  const transcriptionManager = getTranscriptionManager();
  const connectionId = transcriptionManager.getCallConnectionIDFromServerCallId(serverCallId);
  if (!connectionId) {
    res.status(404).send('Call not found');
    return;
  }
  const transcript = transcriptionManager.getTranscriptionData(connectionId);

  if (!transcript) {
    res.status(404).send('Transcription not found');
    return;
  } else {
    console.log('Transcription found:', transcript);
  }

  const response: FetchTranscriptResponse = { transcript: transcript.data };
  res.status(200).send(response);
});

export default router;
