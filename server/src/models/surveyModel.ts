// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export interface SurveyResultRequestModel {
  createdOn: Date;
  callId: string;
  acsUserId: string;
  meetingLink: string;
  response: OneQuestionPollResult;
}

export type SurveyResultRequest = Omit<SurveyResultRequestModel, 'createdOn'>;

export type OneQuestionPollResult = boolean | string | number;
