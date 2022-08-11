// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { parseConnectionString } from '@azure/communication-common';

import {
  VV_COMMUNICATION_SERVICES_CONNECTION_STRING,
  VV_CHAT_ENABLED_ENV_NAME,
  VV_COLOR_PALETTE_ENV_NAME,
  VV_COMPANY_NAME_ENV_NAME,
  VV_MICROSOFT_BOOKINGS_URL_ENV_NAME,
  VV_SCREENSHARE_ENABLED_ENV_NAME,
  VV_WAITING_SUBTITLE_ENV_NAME,
  VV_WAITING_TITLE_ENV_NAME,
  VV_LOGO_URL_ENV_NAME,
  VV_POSTCALL_SURVEY_TYPE_ENV_NAME,
  VV_POSTCALL_SURVEY_OPTIONS_SURVEYURL_ENV_NAME
} from '../constants';

import { ServerConfigModel, ClientConfigModel, PostCallSurveyType, PostCallConfig } from '../models/configModel';
import { getDefaultConfig } from './getDefaultConfig';

export const getServerConfig = (): ServerConfigModel => {
  const defaultConfig = getDefaultConfig();

  const config = {
    communicationServicesConnectionString:
      process.env[VV_COMMUNICATION_SERVICES_CONNECTION_STRING] ?? defaultConfig.communicationServicesConnectionString,
    microsoftBookingsUrl: process.env[VV_MICROSOFT_BOOKINGS_URL_ENV_NAME] ?? defaultConfig.microsoftBookingsUrl,
    chatEnabled:
      typeof process.env[VV_CHAT_ENABLED_ENV_NAME] === 'string'
        ? process.env[VV_CHAT_ENABLED_ENV_NAME]?.toLowerCase() === 'true'
        : defaultConfig.chatEnabled,
    screenShareEnabled:
      typeof process.env[VV_SCREENSHARE_ENABLED_ENV_NAME] === 'string'
        ? process.env[VV_SCREENSHARE_ENABLED_ENV_NAME]?.toLowerCase() === 'true'
        : defaultConfig.screenShareEnabled,
    companyName: process.env[VV_COMPANY_NAME_ENV_NAME] ?? defaultConfig.companyName,
    colorPalette: process.env[VV_COLOR_PALETTE_ENV_NAME] ?? defaultConfig.colorPalette,
    waitingTitle: process.env[VV_WAITING_TITLE_ENV_NAME] ?? defaultConfig.waitingTitle,
    waitingSubtitle: process.env[VV_WAITING_SUBTITLE_ENV_NAME] ?? defaultConfig.waitingSubtitle,
    logoUrl: process.env[VV_LOGO_URL_ENV_NAME] ?? defaultConfig.logoUrl,
    postCall: getPostCallConfig(defaultConfig)
  } as ServerConfigModel;

  return config;
};

const isValidPostCallSurveyType = (postcallSurveyType: string): postcallSurveyType is PostCallSurveyType => {
  return ['msforms', 'thirdparty'].indexOf(postcallSurveyType) !== -1;
};

const getPostCallConfig = (defaultConfig: ServerConfigModel): PostCallConfig | undefined => {
  let postcallConfig: PostCallConfig | undefined;
  //Setting values for postcallconfig from defaultconfig values first (if valid)

  try {
    const postcallSurveyType = process.env[VV_POSTCALL_SURVEY_TYPE_ENV_NAME] ?? defaultConfig.postCall?.survey?.type;
    const postcallSurveyUrl =
      process.env[VV_POSTCALL_SURVEY_OPTIONS_SURVEYURL_ENV_NAME] ?? defaultConfig.postCall?.survey?.options?.surveyUrl;

    if (postcallSurveyType && isValidPostCallSurveyType(postcallSurveyType) && postcallSurveyUrl) {
      postcallConfig = {
        survey: { type: postcallSurveyType, options: { surveyUrl: postcallSurveyUrl } }
      };
    }
  } catch (e) {
    console.error('Unable to parse post call values from environment variables');
  }
  return postcallConfig;
};

export const getClientConfig = (serverConfig: ServerConfigModel): ClientConfigModel => {
  const endpointCredential = parseConnectionString(serverConfig.communicationServicesConnectionString);

  const config = {
    communicationEndpoint: endpointCredential.endpoint,
    microsoftBookingsUrl: serverConfig.microsoftBookingsUrl,
    chatEnabled: serverConfig.chatEnabled,
    screenShareEnabled: serverConfig.screenShareEnabled,
    companyName: serverConfig.companyName,
    colorPalette: serverConfig.colorPalette,
    waitingTitle: serverConfig.waitingTitle,
    waitingSubtitle: serverConfig.waitingSubtitle,
    logoUrl: serverConfig.logoUrl,
    postCall: serverConfig.postCall
  } as ClientConfigModel;

  return config;
};
