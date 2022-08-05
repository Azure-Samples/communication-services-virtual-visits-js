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
  VV_LOGO_URL_ENV_NAME
} from '../constants';

import { ServerConfigModel, ClientConfigModel, PostCallSurveyType } from '../models/configModel';
import DefaultConfig from '../defaultConfig.json';

export const getDefaultConfig = (): typeof DefaultConfig => {
  return DefaultConfig;
};

export const getServerConfig = (): ServerConfigModel => {
  const defaultConfigObj = getDefaultConfig();

  const config = {
    communicationServicesConnectionString:
      process.env[VV_COMMUNICATION_SERVICES_CONNECTION_STRING] ??
      defaultConfigObj.communicationServicesConnectionString,
    microsoftBookingsUrl: process.env[VV_MICROSOFT_BOOKINGS_URL_ENV_NAME] ?? defaultConfigObj.microsoftBookingsUrl,
    chatEnabled:
      typeof process.env[VV_CHAT_ENABLED_ENV_NAME] === 'string'
        ? process.env[VV_CHAT_ENABLED_ENV_NAME]?.toLowerCase() === 'true'
        : defaultConfigObj.chatEnabled,
    screenShareEnabled:
      typeof process.env[VV_SCREENSHARE_ENABLED_ENV_NAME] === 'string'
        ? process.env[VV_SCREENSHARE_ENABLED_ENV_NAME]?.toLowerCase() === 'true'
        : defaultConfigObj.screenShareEnabled,
    companyName: process.env[VV_COMPANY_NAME_ENV_NAME] ?? defaultConfigObj.companyName,
    colorPalette: process.env[VV_COLOR_PALETTE_ENV_NAME] ?? defaultConfigObj.colorPalette,
    waitingTitle: process.env[VV_WAITING_TITLE_ENV_NAME] ?? defaultConfigObj.waitingTitle,
    waitingSubtitle: process.env[VV_WAITING_SUBTITLE_ENV_NAME] ?? defaultConfigObj.waitingSubtitle,
    logoUrl: process.env[VV_LOGO_URL_ENV_NAME] ?? defaultConfigObj.logoUrl
  } as ServerConfigModel;
  if (defaultConfigObj.postCall?.survey?.type) {
    config.postCall = {
      survey: {
        type: defaultConfigObj.postCall.survey.type as PostCallSurveyType,
        options: {
          surveyUrl: defaultConfigObj.postCall.survey.options?.surveyUrl
        }
      }
    };
  }
  return config;
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
    logoUrl: serverConfig.logoUrl
  } as ClientConfigModel;

  if (serverConfig.postCall?.survey?.type) {
    config.postCall = {
      survey: {
        type: serverConfig.postCall?.survey?.type as PostCallSurveyType,
        options: {
          surveyUrl: serverConfig.postCall?.survey?.options?.surveyUrl
        }
      }
    };
  }
  return config;
};
