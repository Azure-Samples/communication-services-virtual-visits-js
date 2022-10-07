// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { SurveyResultRequest } from '../models/surveyModel';

export const surveyResultRequestValidator = (requestData: SurveyResultRequest): string[] => {
  const { callId, acsUserId, response } = requestData;
  const errors: string[] = [];
  const responseAllowedtypes = ['boolean', 'number', 'string'];

  // Check fields are undefined
  if (!callId) errors.push('callId is missing');
  if (!acsUserId) errors.push('acsUserId is missing');
  if (response === undefined) errors.push('response is missing');

  // Check if each field types are correct
  if (callId && typeof callId !== 'string') errors.push('callId type must be string');
  if (acsUserId && typeof acsUserId !== 'string') errors.push('acsUserId type must be string');
  if (response !== undefined && !responseAllowedtypes.includes(typeof response))
    errors.push('response type must be one of boolean, string, number');

  return errors;
};
