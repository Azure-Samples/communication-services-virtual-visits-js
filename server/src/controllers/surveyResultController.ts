// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as express from 'express';
import SurveyResultRequest from '../models/surveyResultRequest';
import { SurveyResultRequestModel } from '../interfaces/surveyModel';
import {
  virtualVisitsDatabaseName,
  surveyContainerName,
  cosmosClient,
  createDatabase,
  createContainer
} from '../utils/cosmosClient';

export const storeSurveyResult = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { body: requestData } = req;
    const { sessionId, callId, acsUserId, response } = requestData;

    // Validation.
    // If any one of field does not exists in the payload the validation failed.
    if (!(sessionId && callId && acsUserId && response)) {
      return res.status(400).send({ error: 'Payload invalid.' });
    }

    const inputData: SurveyResultRequestModel = {
      ...requestData,
      dateTime: new Date()
    };

    const survey = new SurveyResultRequest(inputData);

    // Create database and container.
    await createDatabase();
    await createContainer();

    // Store survey result.
    await cosmosClient.database(virtualVisitsDatabaseName).container(surveyContainerName).items.upsert(survey);

    res.json('Store successfully.');
  } catch (error) {
    return next(error);
  }
};
