// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Theme } from '@fluentui/theme';

type PostCallSurveyType = 'msforms' | 'thirdparty';
interface MSFormsSurveryOptions {
  surveyUrl: string;
}
interface ThirdPartySurveyOptions {
  surveyUrl: string;
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
  postCall?: {
    survey?: {
      type: PostCallSurveyType;
      options: MSFormsSurveryOptions | ThirdPartySurveyOptions;
    };
  };
}
