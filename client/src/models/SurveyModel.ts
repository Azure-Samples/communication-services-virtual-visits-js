// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export interface SurveyResultRequestModel {
  callId: string;
  acsUserId: string;
  response: OneQuestionPollResult;
}

export type OneQuestionPollResult = boolean | string | number;
