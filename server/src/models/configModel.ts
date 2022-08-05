// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

type PostCallSurveyType = 'msforms' | 'onepage' | 'thirdparty';

interface MSFormsSurveryOptions {
  surveyUrl: string;
}

interface ThirdPartySurveyOptions {
  surveyUrl: string;
}

export interface PostCallConfig {
  survey?: {
    type: PostCallSurveyType;
    options: MSFormsSurveryOptions | ThirdPartySurveyOptions;
  };
}

export interface ServerConfigModel {
  communicationServicesConnectionString: string;
  microsoftBookingsUrl: string;
  chatEnabled: boolean;
  screenShareEnabled: boolean;
  companyName: string;
  colorPalette: string;
  waitingTitle: string;
  waitingSubtitle: string;
  logoUrl: string;
  postCall?: PostCallConfig | null;
}

export interface ClientConfigModel {
  communicationEndpoint: string;
  microsoftBookingsUrl: string;
  chatEnabled: boolean;
  screenShareEnabled: boolean;
  companyName: string;
  colorPalette: string;
  waitingTitle: string;
  waitingSubtitle: string;
  logoUrl: string;
  postCall?: PostCallConfig | null;
}
