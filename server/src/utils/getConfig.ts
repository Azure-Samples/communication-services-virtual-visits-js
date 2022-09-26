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
  VV_POSTCALL_SURVEY_OPTIONS_SURVEYURL_ENV_NAME,
  VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_PROMPT_ENV_NAME,
  VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_TYPE_ENV_NAME,
  VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_TITLE_ENV_NAME,
  VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_SAVE_BUTTON_TEXT_ENV_NAME,
  VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_ANSWER_PLACEHOLDER_ENV_NAME
} from '../constants';

import {
  ServerConfigModel,
  ClientConfigModel,
  PostCallSurveyType,
  PostCallConfig,
  MSFormsSurveyOptions,
  OneQuestionPollOptions,
  OneQuestionPollType,
  CustomSurveyOptions
} from '../models/configModel';
import { getDefaultConfig } from './getDefaultConfig';

export const getMSFormsOptions = (defaultConfig: ServerConfigModel): MSFormsSurveyOptions => {
  const options: MSFormsSurveyOptions = defaultConfig.postCall?.survey?.options as MSFormsSurveyOptions;
  const postcallSurveyUrl = process.env[VV_POSTCALL_SURVEY_OPTIONS_SURVEYURL_ENV_NAME] ?? options.surveyUrl;
  return { surveyUrl: postcallSurveyUrl };
};

export const getCustomSurveyOptions = (defaultConfig: ServerConfigModel): CustomSurveyOptions => {
  const options: CustomSurveyOptions = defaultConfig.postCall?.survey?.options as CustomSurveyOptions;
  const postcallSurveyUrl = process.env[VV_POSTCALL_SURVEY_OPTIONS_SURVEYURL_ENV_NAME] ?? options.surveyUrl;
  return { surveyUrl: postcallSurveyUrl };
};

export const getOneQuestionPollOptions = (defaultConfig: ServerConfigModel): OneQuestionPollOptions => {
  const options: OneQuestionPollOptions = defaultConfig.postCall?.survey?.options as OneQuestionPollOptions;
  const surveyTitle = process.env[VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_TITLE_ENV_NAME] ?? options.title;
  const surveyPollType: OneQuestionPollType =
    (process.env[VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_TYPE_ENV_NAME] as OneQuestionPollType) ??
    (options.pollType as OneQuestionPollType);
  const surveyPrompt = process.env[VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_PROMPT_ENV_NAME] ?? options.prompt;
  const answerPlaceholder =
    process.env[VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_ANSWER_PLACEHOLDER_ENV_NAME] ?? options.answerPlaceholder;
  const surveySaveButtonText =
    process.env[VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_SAVE_BUTTON_TEXT_ENV_NAME] ?? options.saveButtonText;
  return {
    title: surveyTitle,
    prompt: surveyPrompt,
    pollType: surveyPollType,
    answerPlaceholder: answerPlaceholder,
    saveButtonText: surveySaveButtonText
  };
};

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
  return ['msforms', 'custom', 'onequestionpoll'].indexOf(postcallSurveyType) !== -1;
};

const getPostCallConfig = (defaultConfig: ServerConfigModel): PostCallConfig | undefined => {
  let postcallConfig: PostCallConfig | undefined;
  //Setting values for postcallconfig from defaultconfig values first (if valid)

  try {
    const postcallSurveyType = process.env[VV_POSTCALL_SURVEY_TYPE_ENV_NAME] ?? defaultConfig.postCall?.survey.type;
    if (!postcallSurveyType || !isValidPostCallSurveyType(postcallSurveyType)) {
      return undefined;
    }

    if (postcallSurveyType === 'msforms') {
      const configOptions: MSFormsSurveyOptions = getMSFormsOptions(defaultConfig);
      postcallConfig = {
        survey: { type: postcallSurveyType, options: configOptions }
      };
    } else if (postcallSurveyType === 'custom') {
      const configOptions: CustomSurveyOptions = getCustomSurveyOptions(defaultConfig);
      postcallConfig = {
        survey: { type: postcallSurveyType, options: configOptions }
      };
    } else if (postcallSurveyType === 'onequestionpoll') {
      const configOptions: OneQuestionPollOptions = getOneQuestionPollOptions(defaultConfig);
      postcallConfig = {
        survey: { type: postcallSurveyType, options: configOptions }
      };
    } else {
      postcallConfig = undefined;
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
