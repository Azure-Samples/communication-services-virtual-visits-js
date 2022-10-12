// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  VV_POSTCALL_SURVEY_TYPE_ENV_NAME,
  VV_POSTCALL_SURVEY_OPTIONS_SURVEYURL_ENV_NAME,
  VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_PROMPT_ENV_NAME,
  VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_TYPE_ENV_NAME,
  VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_TITLE_ENV_NAME,
  VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_SAVE_BUTTON_TEXT_ENV_NAME,
  VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_ANSWER_PLACEHOLDER_ENV_NAME
} from '../constants';
import {
  CustomSurveyOptions,
  MSFormsSurveyOptions,
  OneQuestionPollOptions,
  OneQuestionPollType,
  PostCallConfig,
  PostCallSurveyType,
  ServerConfigModel
} from '../models/configModel';

const getPostCallConfig = (defaultConfig: ServerConfigModel): PostCallConfig | undefined => {
  const postcallSurveyType = process.env[VV_POSTCALL_SURVEY_TYPE_ENV_NAME] ?? defaultConfig.postCall?.survey.type;
  if (!postcallSurveyType || !isValidPostCallSurveyType(postcallSurveyType)) {
    return undefined;
  }

  let postCallOptions: MSFormsSurveyOptions | CustomSurveyOptions | OneQuestionPollOptions | undefined;

  try {
    if (postcallSurveyType === 'msforms') {
      postCallOptions = getMSFormsOptions(defaultConfig);
    } else if (postcallSurveyType === 'custom') {
      postCallOptions = getCustomSurveyOptions(defaultConfig);
    } else if (postcallSurveyType === 'onequestionpoll') {
      postCallOptions = getOneQuestionPollOptions(defaultConfig);
    }
  } catch (e) {
    console.error('Unable to parse post call values from environment variables');
    return undefined;
  }

  if (postCallOptions === undefined) {
    return undefined;
  }

  const postCallConfig: PostCallConfig = {
    survey: {
      type: postcallSurveyType,
      options: postCallOptions
    }
  };

  return postCallConfig;
};

const isValidPostCallSurveyType = (postcallSurveyType: string): postcallSurveyType is PostCallSurveyType => {
  return ['msforms', 'custom', 'onequestionpoll'].indexOf(postcallSurveyType) !== -1;
};

const getMSFormsOptions = (defaultConfig: ServerConfigModel): MSFormsSurveyOptions => {
  const options: MSFormsSurveyOptions = defaultConfig.postCall?.survey?.options as MSFormsSurveyOptions;
  const postcallSurveyUrl = process.env[VV_POSTCALL_SURVEY_OPTIONS_SURVEYURL_ENV_NAME] ?? options.surveyUrl;
  return { surveyUrl: postcallSurveyUrl };
};

const getCustomSurveyOptions = (defaultConfig: ServerConfigModel): CustomSurveyOptions => {
  const options: CustomSurveyOptions = defaultConfig.postCall?.survey?.options as CustomSurveyOptions;
  const postcallSurveyUrl = process.env[VV_POSTCALL_SURVEY_OPTIONS_SURVEYURL_ENV_NAME] ?? options.surveyUrl;
  return { surveyUrl: postcallSurveyUrl };
};

const getOneQuestionPollOptions = (defaultConfig: ServerConfigModel): OneQuestionPollOptions => {
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

export default getPostCallConfig;
