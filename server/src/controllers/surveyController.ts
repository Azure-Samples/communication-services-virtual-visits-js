// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as express from 'express';
import SurveyService from '../services/surveyService';
import { SurveyResultRequestModel } from '../models/surveyModel';

export const storeSurveyResult = (surveyService: SurveyService) => async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { body: requestData } = req;
    const { sessionId, callId, acsUserId, response } = requestData;

    // Validation.
    // If any one of field does not exists in the payload the validation failed.
    if (!(sessionId && callId && acsUserId && response)) {
      let errors: string[] = [];

      if (!sessionId) errors.push('sessionId is missing');
      if (!callId) errors.push('callId is missing');
      if (!acsUserId) errors.push('acsUserId is missing');
      if (!response) errors.push('response is missing');
      return res.status(400).send({ errors });
    }

    const inputData: SurveyResultRequestModel = {
      ...requestData,
      createdOn: new Date()
    };

    await surveyService.init();
    await surveyService.saveSurveyResult(inputData);

    res.json('Store successfully.');
  } catch (error) {
    return next(error);
  }
};
