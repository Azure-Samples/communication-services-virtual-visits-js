// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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
  postCall?: PostCallConfig;
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
  postCall?: PostCallConfig;
}
