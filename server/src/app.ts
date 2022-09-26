// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import express from 'express';
import path from 'path';
import { CommunicationIdentityClient } from '@azure/communication-identity';
import { getServerConfig } from './utils/getConfig';
import { removeJsonpCallback } from './utils/removeJsonpCallback';
import { configController } from './controllers/configController';
import { tokenController } from './controllers/tokenController';
import { storeSurveyResult } from './controllers/surveyController';
import CosmosClient from './databases/cosmosClient';
import SurveyDBHandler from './databases/handlers/surveyDBHandler';
import { ERROR_PAYLOAD_500 } from './errors';

const app = express();

app.use(express.static('public'));
app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

app.use(removeJsonpCallback);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_, res) => {
  res.redirect('book');
});

app.get('/book', (_, res) => {
  res.sendFile(path.join(__dirname, 'public/book.html'));
});

app.get('/visit', (_, res) => {
  res.sendFile(path.join(__dirname, 'public/visit.html'));
});

const config = getServerConfig();

const identityClient =
  process.env.NODE_ENV === 'test'
    ? ({} as CommunicationIdentityClient)
    : new CommunicationIdentityClient(config.communicationServicesConnectionString);

app.get('/api/config', configController(config));
app.get('/api/token', tokenController(identityClient, config));

const cosmosClient = new CosmosClient(config);
const surveyDBHandler = new SurveyDBHandler(cosmosClient);

app.post('/api/createSurveyResult', storeSurveyResult(surveyDBHandler));

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'public/pageNotFound.html'));
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json(ERROR_PAYLOAD_500);
});

export default app;
