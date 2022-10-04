// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export type SurveyResultModel = OneQuestionPollResult;

interface OneQuestionPollResult {
  prompResult: boolean | string | number;
}
