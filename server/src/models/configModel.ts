// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
export type PostCallSurveyType = 'none' | 'msforms' | 'onequestion' | 'thirdparty';
interface MSFormsSurveryOptions {
  surveyUrl: string;
}
interface ThirdPartySurveyOptions {
  surveyUrl: string;
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
  postCall?: {
    survey?: {
      type: PostCallSurveyType;
      options: MSFormsSurveryOptions | ThirdPartySurveyOptions;
    };
  };
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
  postCall?: {
    survey?: {
      type: PostCallSurveyType;
      options: MSFormsSurveryOptions | ThirdPartySurveyOptions;
    };
  };
}
