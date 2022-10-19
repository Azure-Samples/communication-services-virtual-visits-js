// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as express from 'express';
import SurveyDBHandler from '../databaseHandlers/surveyDBHandler';
import { surveyResultRequestValidator } from '../utils/validators';
import { SurveyResultRequestModel } from '../models/surveyModel';

export const storeSurveyResult = (surveyDBHandler: SurveyDBHandler) => async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<any> => {
  try {
    const { body: requestData } = req;

    // Validation.
    const errors = surveyResultRequestValidator(requestData);

    if (errors.length > 0) {
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
