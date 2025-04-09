// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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

export interface CosmosDBConfig {
  connectionString: string;
  dbName: string;
}

export interface CallAutomationConfig {
  CognitionAPIEndpoint: string;
  CognitionAPIKey: string;
  ServerHttpUrl: string;
  ServerWebSocketPort: number;
  ServerWebSocketUrl: string;
  AutoStartTranscription: boolean;
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
  cosmosDb?: CosmosDBConfig;
  callAutomation?: CallAutomationConfig;
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
  ServerWebSocketUrl?: string;
}
