// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as express from 'express';
import SurveyDBHandler from '../databaseHandlers/surveyDBHandler';
import { SurveyResultRequestModel } from '../models/surveyModel';

export const storeSurveyResult = (surveyDBHandler: SurveyDBHandler) => async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<any> => {
  try {
    const { body: requestData } = req;
    const { callId, acsUserId, response } = requestData;

    // Validation.
    // If any one of field does not exists in the payload the validation failed.
    if (!callId || !acsUserId || response === undefined) {
      const errors: string[] = [];

      if (!callId) errors.push('callId is missing');
      if (!acsUserId) errors.push('acsUserId is missing');
      if (response === undefined) errors.push('response is missing');

      return res.status(400).send({ errors });
    }

    const inputData: SurveyResultRequestModel = {
      ...requestData,
      createdOn: new Date()
    };

    await surveyDBHandler.saveSurveyResult(inputData);

    return res.status(200).send();
  } catch (error) {
    return next(error);
  }
};
