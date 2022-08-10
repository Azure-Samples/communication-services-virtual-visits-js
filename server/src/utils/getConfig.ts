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

import { ServerConfigModel, ClientConfigModel, PostCallSurveyType } from '../models/configModel';
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
    logoUrl: process.env[VV_LOGO_URL_ENV_NAME] ?? defaultConfig.logoUrl
  } as ServerConfigModel;

  //Check environment variables for values for postCall and set them if present
  //else check defaultConfig.json for postCall config values and use them
  let postCallType: PostCallSurveyType;
  let postCallSurveyUrl;
  if (
    typeof process.env[VV_POSTCALL_SURVEY_TYPE_ENV_NAME] !== undefined &&
    process.env[VV_POSTCALL_SURVEY_OPTIONS_SURVEYURL_ENV_NAME] !== undefined &&
    (process.env[VV_POSTCALL_SURVEY_TYPE_ENV_NAME] === 'msforms' ||
      process.env[VV_POSTCALL_SURVEY_TYPE_ENV_NAME] === 'thirdparty')
  ) {
    postCallType = <PostCallSurveyType>process.env[VV_POSTCALL_SURVEY_TYPE_ENV_NAME]?.toLowerCase();
    postCallSurveyUrl =
      process.env[VV_POSTCALL_SURVEY_OPTIONS_SURVEYURL_ENV_NAME] !== undefined
        ? process.env[VV_POSTCALL_SURVEY_OPTIONS_SURVEYURL_ENV_NAME]
        : '';

    config.postCall = {
      survey: { type: postCallType, options: { surveyUrl: postCallSurveyUrl } }
    };
  } else if (defaultConfig.postCall?.survey?.type) {
    postCallType = <PostCallSurveyType>defaultConfig.postCall?.survey?.type;
    postCallSurveyUrl = defaultConfig.postCall?.survey?.options?.surveyUrl;
    config.postCall = {
      survey: { type: postCallType, options: { surveyUrl: postCallSurveyUrl } }
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
        type: <PostCallSurveyType>serverConfig.postCall?.survey?.type,
        options: {
          surveyUrl: serverConfig.postCall?.survey?.options?.surveyUrl
        }
      }
    };
  }
  return config;
};
