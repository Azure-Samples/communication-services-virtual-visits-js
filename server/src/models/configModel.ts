// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export type PostCallSurveyType = 'msforms' | 'custom' | 'onequestionpoll';
export interface MSFormsSurveyOptions {
  surveyUrl: string;
}
export interface CustomSurveyOptions {
  surveyUrl: string;
}

export type OneQuestionPollPromptType = 'likeorDislike' | 'rating' | 'text';

export interface OneQuestionPollOptions {
  title?: string;
  prompt: string;
  promptType: OneQuestionPollPromptType;
  saveButtonText: string;
}
export interface PostCallConfig {
  survey: {
    type: PostCallSurveyType;
    options: MSFormsSurveyOptions | CustomSurveyOptions | OneQuestionPollOptions;
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
