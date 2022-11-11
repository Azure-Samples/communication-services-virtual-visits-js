// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { SurveyResultRequest } from '../models/surveyModel';
import { JoinRoomRequest } from '../models/roomModel';

export const surveyResultRequestValidator = (requestData: SurveyResultRequest): string[] => {
  const { callId, acsUserId, meetingLink, response } = requestData;
  const errors: string[] = [];
  const responseAllowedtypes = ['boolean', 'number', 'string'];

  // Check if fields are defined
  if (!callId) errors.push('callId must be present');
  if (!acsUserId) errors.push('acsUserId must be present');
  if (!meetingLink) errors.push('meetingLink must be present');
  if (response === undefined) errors.push('response must be present');

  // Check if each field types are correct
  if (callId && typeof callId !== 'string') errors.push('callId type must be string');
  if (acsUserId && typeof acsUserId !== 'string') errors.push('acsUserId type must be string');
  if (meetingLink && typeof meetingLink !== 'string') errors.push('meetingLink type must be string');
  if (response !== undefined && !responseAllowedtypes.includes(typeof response))
    errors.push('response type must be one of boolean, string, number');

  return errors;
};

export const joinRoomRequestValidator = (requestData: JoinRoomRequest): string[] => {
  const { roomId, userId } = requestData;
  const errors: string[] = [];

  // Check if fields are defined
  if (!roomId) errors.push('roomId must be present');
  if (!userId) errors.push('userId must be present');

  // Check if each field types are correct
  if (roomId && typeof roomId !== 'string') errors.push('roomId type must be string');
  if (userId && typeof userId !== 'string') errors.push('userId type must be string');

  return errors;
};
