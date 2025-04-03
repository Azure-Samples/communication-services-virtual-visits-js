// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import express from 'express';
import path from 'path';
import cors from 'cors';
import WebSocket from 'ws';
import { CommunicationIdentityClient } from '@azure/communication-identity';
import { RoomsClient } from '@azure/communication-rooms';
import { getServerConfig } from './utils/getConfig';
import { removeJsonpCallback } from './utils/removeJsonpCallback';
import { roomsRouter } from './routes/roomsRoutes';
import { configController } from './controllers/configController';
import { tokenController } from './controllers/tokenController';
import { storeSurveyResult } from './controllers/surveyController';
import { createSurveyDBHandler } from './databaseHandlers/surveyDBHandler';
import { ERROR_PAYLOAD_500 } from './constants';
import connectRoomsCall from './routes/connectToRoomsCall';
import startTranscription from './routes/startTranscription';
import stopTranscriptionForCall from './routes/stopTranscription';
import fetchTranscript from './routes/fetchTranscript';
import startCallWithTranscription from './routes/startRoomsCallWithTranscription';
import callAutomationEvent from './routes/callAutomationEvent';
import summarizeTranscript from './routes/summarizeTranscript';
import notificationEvents from './routes/notificationEvents';
import { handleTranscriptionEvent } from './utils/callAutomationUtils';

const app = express();
export const clients: express.Response[] = []; // Store connected clients

app.use(express.static('public'));
app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  next();
});

app.use(removeJsonpCallback);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/book', (_, res) => {
  res.sendFile(path.join(__dirname, 'public/book.html'));
});

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'public/home.html'));
});

app.get('/visit', (_, res) => {
  res.sendFile(path.join(__dirname, 'public/visit.html'));
});

/**
 * route: /connectToRoom
 * purpose: Calling: connect to an existing room
 */
app.use('/api/connectRoomsCall', cors(), connectRoomsCall);
/**
 * route: /startTranscription
 * purpose: Start transcription for an established call
 */
app.use('/api/startTranscription', cors(), startTranscription);

/**
 * route: /stopTranscription
 * purpose: Stop transcription for an established call
 */
app.use('/api/stopTranscription', cors(), stopTranscriptionForCall);

/**
 * route: /fetchTranscript
 * purpose: Fetch an existing transcription
 */
app.use('/api/fetchTranscript', cors(), fetchTranscript);

/**
 * route: /startCallWithTranscription
 * purpose: Start a new group call with transcription
 */
app.use('/api/startCallWithTranscription', cors(), startCallWithTranscription);
/**
 * route: /callAutomationEvent
 * purpose: Call Automation: receive call automation events
 */
app.use('/api/callAutomationEvent', cors(), callAutomationEvent);

/**
 * route: /summarizeTranscript
 * purpose: Sends transcript to AI summarization service
 */
app.use('/api/summarizeTranscript', cors(), summarizeTranscript);

/**
 * route: /api/notificationEvents
 * purpose: endpoint to hit to open a server sent events (SSE) connection to
 * recieve events from the server
 */
app.use('/api/notificationEvents', cors(), notificationEvents);

const config = getServerConfig();
/**
 * route: wss://<host>/
 * purpose: WebSocket endpoint to receive transcription events
 *
 * Don't forget to secure this endpoint in production
 * https://learn.microsoft.com/en-us/azure/communication-services/how-tos/call-automation/secure-webhook-endpoint?pivots=programming-language-javascript
 */
console.log('WebSocket server port:', config.callAutomation?.ServerWebSocketPort);

const wss = new WebSocket.Server({ port: config.callAutomation?.ServerWebSocketPort });

wss.on('connection', (ws) => {
  let transcriptionCorrelationId: string | undefined;

  ws.on('open', () => {
    console.log('WebSocket opened');
  });

  ws.on('message', (message: WebSocket.RawData) => {
    const decoder = new TextDecoder();
    const messageData = JSON.parse(decoder.decode(message as ArrayBuffer));
    if (
      ('kind' in messageData && messageData.kind === 'TranscriptionMetadata') ||
      ('kind' in messageData && messageData.kind === 'TranscriptionData')
    ) {
      transcriptionCorrelationId = handleTranscriptionEvent(message, transcriptionCorrelationId);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket closed');
  });
  console.log('websocket server running on port', config.callAutomation?.ServerWebSocketPort);
});

const surveyDBHandler = createSurveyDBHandler(config);
if (surveyDBHandler) {
  surveyDBHandler.init();

  app.post('/api/surveyResults', storeSurveyResult(surveyDBHandler));
} else if (config.postCall && config.postCall.survey.type === 'onequestionpoll') {
  config.postCall = undefined;
}

const identityClient =
  process.env.NODE_ENV === 'test'
    ? ({} as CommunicationIdentityClient)
    : new CommunicationIdentityClient(config.communicationServicesConnectionString);

const roomsClient =
  process.env.NODE_ENV === 'test' ? ({} as RoomsClient) : new RoomsClient(config.communicationServicesConnectionString);

app.get('/api/config', configController(config));
app.get('/api/token', tokenController(identityClient, config));
app.use('/api/rooms', roomsRouter(identityClient, roomsClient));

// Function to send events to all connected clients
export const sendEventToClients = (event: string, data: Record<string, unknown>): void => {
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  clients.forEach((client) => client.write(message));
};

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'public/pageNotFound.html'));
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).send({ error: err?.message ?? ERROR_PAYLOAD_500 });
});

export default app;
