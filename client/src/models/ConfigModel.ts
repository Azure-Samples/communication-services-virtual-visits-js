// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Theme } from '@fluentui/theme';

export type PostCallSurveyType = 'msforms' | 'custom';
interface MSFormsSurveyOptions {
  surveyUrl: string;
}
interface CustomSurveyOptions {
  surveyUrl: string;
}

export interface PostCallConfig {
  survey: {
    type: PostCallSurveyType;
    options: MSFormsSurveyOptions | CustomSurveyOptions;
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
