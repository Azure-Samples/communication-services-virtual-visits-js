// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export interface SurveyResultRequestModel {
  dateTime: Date;
  sessionId: string;
  callId: string;
  acsUserId: string;
  response: OneQuestionPollResult;
}

export type OneQuestionPollResult = boolean | string | number;

export type SurveyResultResponseModel = OneQuestionPollResult;
