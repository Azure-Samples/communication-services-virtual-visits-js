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
import { ServerConfigModel, ClientConfigModel, PostCallConfig } from '../models/configModel';
import { getDefaultConfig } from './getDefaultConfig';

export const getServerConfig = (): ServerConfigModel => {
  const defaultConfig = getDefaultConfig();
  const postCallConfig = getPostCallConfig(defaultConfig);
  return {
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
    postCall: postCallConfig
  };
};

export const getClientConfig = (serverConfig: ServerConfigModel): ClientConfigModel => {
  const endpointCredential = parseConnectionString(serverConfig.communicationServicesConnectionString);
  return {
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
  };
};

const getPostCallConfig = (defaultConfig: ServerConfigModel): PostCallConfig | null | undefined => {
  let postCallConfig: PostCallConfig | null | undefined = defaultConfig.postCall;

  // TODO: try getting post call from environment variables
  // try {
  //   const postCallEnvValue = process.env[VV_POSTCALL_CONFIG_ENV_NAME];
  //   if (postCallEnvValue) {
  //     postCallConfig = JSON.parse(postCallEnvValue);
  //   }
  // } catch(e) {
  //   console.error('Unable to parse post call config from environment variables');
  //   postCallConfig = defaultConfig.postCall;
  // }

  return postCallConfig;
};
