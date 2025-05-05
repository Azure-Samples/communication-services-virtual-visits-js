// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as express from 'express';
import { startTranscriptionForCall } from '../utils/callAutomationUtils';
import { TranscriptionOptions } from '@azure/communication-call-automation';
import { sendEventToClients } from '../app';
import { RestError } from '@azure/core-http';

const router = express.Router();
interface StartTranscriptionRequest {
  serverCallId: string;
  options?: TranscriptionOptions;
}

router.post('/', async function (req, res, next) {
  const { serverCallId, options }: StartTranscriptionRequest = req.body;

  console.log('Starting transcription for call:', serverCallId);

  try {
    await startTranscriptionForCall(serverCallId, options);
  } catch (e) {
    console.error(e);
    if ((e as RestError).code === '8500') {
      res.status(400).send('Transcription already started');
      return;
    } else {
      res.status(500).send('Error starting transcription');
      sendEventToClients('TranscriptionError', {
        serverCallId
      });
    }
    return;
  }

  res.status(200).end();
});

export default router;
