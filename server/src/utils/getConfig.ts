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

import { ServerConfigModel, ClientConfigModel } from '../models/configModel';
import DefaultConfig from '../defaultConfig.json';

export const getServerConfig = (): ServerConfigModel => {
  return {
    communicationServicesConnectionString:
      process.env[VV_COMMUNICATION_SERVICES_CONNECTION_STRING] ?? DefaultConfig.communicationServicesConnectionString,
    microsoftBookingsUrl: process.env[VV_MICROSOFT_BOOKINGS_URL_ENV_NAME] ?? DefaultConfig.microsoftBookingsUrl,
    chatEnabled:
      typeof process.env[VV_CHAT_ENABLED_ENV_NAME] === 'string'
        ? process.env[VV_CHAT_ENABLED_ENV_NAME]?.toLowerCase() === 'true'
        : DefaultConfig.chatEnabled,
    screenShareEnabled:
      typeof process.env[VV_SCREENSHARE_ENABLED_ENV_NAME] === 'string'
        ? process.env[VV_SCREENSHARE_ENABLED_ENV_NAME]?.toLowerCase() === 'true'
        : DefaultConfig.screenShareEnabled,
    companyName: process.env[VV_COMPANY_NAME_ENV_NAME] ?? DefaultConfig.companyName,
    colorPalette: process.env[VV_COLOR_PALETTE_ENV_NAME] ?? DefaultConfig.colorPalette,
    waitingTitle: process.env[VV_WAITING_TITLE_ENV_NAME] ?? DefaultConfig.waitingTitle,
    waitingSubtitle: process.env[VV_WAITING_SUBTITLE_ENV_NAME] ?? DefaultConfig.waitingSubtitle,
    logoUrl: process.env[VV_LOGO_URL_ENV_NAME] ?? DefaultConfig.logoUrl
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
    logoUrl: serverConfig.logoUrl
  };
};
