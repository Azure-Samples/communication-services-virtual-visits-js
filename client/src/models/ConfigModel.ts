// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Theme } from '@fluentui/theme';

export type PostCallSurveyType = 'msforms' | 'custom' | 'onequestionpoll';
export interface MSFormsSurveyOptions {
  surveyUrl: string;
}
export interface CustomSurveyOptions {
  surveyUrl: string;
}

export type OneQuestionPollType = 'likeOrDislike' | 'rating' | 'text';

export interface OneQuestionPollOptions {
  title?: string;
  prompt: string;
  pollType: OneQuestionPollType;
  answerPlaceholder?: string;
  saveButtonText: string;
}

export interface PostCallConfig {
  survey: {
    type: PostCallSurveyType;
    options: MSFormsSurveyOptions | CustomSurveyOptions | OneQuestionPollOptions;
  };
}
export interface AppConfigModel {
  communicationEndpoint: string;
  microsoftBookingsUrl: string;
  chatEnabled: boolean;
  screenShareEnabled: boolean;
  companyName: string;
  theme: Theme;
  waitingTitle: string;
  waitingSubtitle: string;
  logoUrl: string;
  postCall?: PostCallConfig;
}
