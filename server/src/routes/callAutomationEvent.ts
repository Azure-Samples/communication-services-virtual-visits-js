// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as express from 'express';
import { CALLCONNECTION_ID_TO_CORRELATION_ID } from '../utils/callAutomationUtils';

const router = express.Router();

router.post('/', async function (req, res) {
  const { callConnectionId, serverCallId, type } = req.body[0]?.data || {};
  try {
    if (type === 'Microsoft.Communication.CallConnected') {
      console.log('/automationEvent received', req.body);
      /**
       * if the call already exists in the mapping exit early to avoid overwriting the mapping and making
       * a new connection through callAutomation.
       */
      if (CALLCONNECTION_ID_TO_CORRELATION_ID[callConnectionId]) {
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
      CALLCONNECTION_ID_TO_CORRELATION_ID[callConnectionId] = {
        serverCallId: serverCallId,
        correlationId: CALLCONNECTION_ID_TO_CORRELATION_ID[callConnectionId as string]?.correlationId
      };
    }
  } catch (e) {
    console.error('Error processing automation event:', e);
    res.status(500).send('Error processing automation event');
  }

  res.status(200).end();
});

export default router;
