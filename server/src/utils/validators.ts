// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import SurveyDBHandler from '../databaseHandlers/surveyDBHandler';
import { SurveyResultRequest } from '../models/surveyModel';

export const surveyResultRequestValidator = async (
  requestData: SurveyResultRequest,
  surveyDBHandler: SurveyDBHandler
): Promise<string[]> => {
  const { callId, acsUserId, response } = requestData;
  const errors: string[] = [];
  const responseAllowedtypes = ['boolean', 'number', 'string'];

  // Check if fields are defined
  if (!callId) errors.push('callId must be present');
  if (!acsUserId) errors.push('acsUserId must be present');
  if (response === undefined) errors.push('response must be present');

  // Check if each field types are correct
  if (callId && typeof callId !== 'string') errors.push('callId type must be string');
  if (acsUserId && typeof acsUserId !== 'string') errors.push('acsUserId type must be string');
  if (response !== undefined && !responseAllowedtypes.includes(typeof response))
    errors.push('response type must be one of boolean, string, number');

  const queryResults = await surveyDBHandler.querySurvey(callId, acsUserId);

  if (queryResults.length > 0)
    errors.push(`Response has already been recorded for call id ${callId} and user id ${acsUserId}`);

  return errors;
};
