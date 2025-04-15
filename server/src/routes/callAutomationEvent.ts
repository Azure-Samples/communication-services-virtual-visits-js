// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as express from 'express';
import { getTranscriptionManager } from '../utils/callAutomationUtils';
import { sendEventToClients } from '../app';

const router = express.Router();

router.post('/', async function (req, res) {
  const { callConnectionId, serverCallId } = req.body[0]?.data || {};
  const { type } = req.body[0];
  try {
    if (type === 'Microsoft.Communication.CallConnected') {
      console.log('/automationEvent received', req.body);
      const hasConnection = getTranscriptionManager().getCallConnection(callConnectionId);
      /**
       * if the call already exists in the mapping exit early to avoid overwriting the mapping and making
       * a new connection through callAutomation.
       */
      if (hasConnection) {
        console.log('CallConnectionId already exists in mapping');
        res.status(200).end();
        return;
      }
      /**
       * Make a mapping here between the callConnectionId and the correlationId
       * The correlationId in the data is the id of the call that we are using to start the transcription this id
       * is from the calling SDK and the callConnectionId is mapped to the correlationId from the transcription
       * service. We need to store this mapping so that we can fetch the transcription later.
       */
      getTranscriptionManager().setCallConnection(callConnectionId, serverCallId);
    } else if (type === 'Microsoft.Communication.TranscriptionStarted') {
      console.log('/automationEvent received', req.body);
      sendEventToClients('TranscriptionStarted', { serverCallId });
    } else if (type === 'Microsoft.Communication.TranscriptionStopped') {
      console.log('/automationEvent received', req.body);
      sendEventToClients('TranscriptionStopped', { serverCallId });
    }
  } catch (e) {
    console.error('Error processing automation event:', e);
    res.status(500).send('Error processing automation event');
  }

  res.status(200).end();
});

export default router;
