// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CustomSurveyOptions, MSFormsSurveyOptions, OneQuestionPollOptions } from '../models/configModel';
import * as getConfig from './getConfig';
import * as getDefaultConfig from './getDefaultConfig';

describe('config', () => {
  beforeEach(() => {
    delete process.env.VV_COMMUNICATION_SERVICES_CONNECTION_STRING;
    delete process.env.VV_MICROSOFT_BOOKINGS_URL;
    delete process.env.VV_CHAT_ENABLED;
    delete process.env.VV_SCREENSHARE_ENABLED;
    delete process.env.VV_COMPANY_NAME;
    delete process.env.VV_COLOR_PALETTE;
    delete process.env.VV_WAITING_TITLE;
    delete process.env.VV_WAITING_SUBTITLE;
    delete process.env.VV_POSTCALL_SURVEY_TYPE;
    delete process.env.VV_POSTCALL_SURVEY_OPTIONS_SURVEYURL;
    delete process.env.VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_TITLE;
    delete process.env.VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_PROMPT;
    delete process.env.VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_TYPE;
    delete process.env.VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_SAVE_BUTTON_TEXT;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should use defaultConfig.json values if environment variables are not defined', () => {
    const mockDefaultConfig = {
      communicationServicesConnectionString: 'test endpoint',
      microsoftBookingsUrl: 'testBookingsUrl',
      chatEnabled: true,
      screenShareEnabled: true,
      companyName: 'test Healthcare',
      colorPalette: '#0078d4',
      waitingTitle: 'Thank you for choosing Lamna Healthcare',
      waitingSubtitle: 'Your clinician is joining the meeting',
      logoUrl: ''
    };
    const getDefaultConfigSpy = jest
      .spyOn(getDefaultConfig, 'getDefaultConfig')
      .mockImplementation((): any => mockDefaultConfig);

    const config = getConfig.getServerConfig();

    expect(getDefaultConfigSpy).toHaveBeenCalled();
    expect(config.communicationServicesConnectionString).toBe(mockDefaultConfig.communicationServicesConnectionString);
    expect(config.microsoftBookingsUrl).toBe(mockDefaultConfig.microsoftBookingsUrl);
    expect(config.chatEnabled).toBe(mockDefaultConfig.chatEnabled);
    expect(config.screenShareEnabled).toBe(mockDefaultConfig.screenShareEnabled);
    expect(config.companyName).toBe(mockDefaultConfig.companyName);
    expect(config.colorPalette).toBe(mockDefaultConfig.colorPalette);
    expect(config.waitingTitle).toBe(mockDefaultConfig.waitingTitle);
    expect(config.waitingSubtitle).toBe(mockDefaultConfig.waitingSubtitle);
    expect(config.postCall).not.toBeDefined();
  });

  test('should use environment variables when available, testing variables for MS Forms post-call survey option ', () => {
    process.env.VV_COMMUNICATION_SERVICES_CONNECTION_STRING = 'MYCONNECTIONSTRING';
    process.env.VV_MICROSOFT_BOOKINGS_URL = 'https://testurl';
    process.env.VV_CHAT_ENABLED = 'True';
    process.env.VV_SCREENSHARE_ENABLED = 'True';
    process.env.VV_COMPANY_NAME = 'Company';
    process.env.VV_COLOR_PALETTE = '#FFFFFF';
    process.env.VV_WAITING_TITLE = 'title';
    process.env.VV_WAITING_SUBTITLE = 'subtitle';
    process.env.VV_LOGO_URL = 'logoUrl';
    process.env.VV_POSTCALL_SURVEY_TYPE = 'msforms';
    process.env.VV_POSTCALL_SURVEY_OPTIONS_SURVEYURL = 'msformstesturl';

    const config = getConfig.getServerConfig();
    const options: MSFormsSurveyOptions = getConfig.getMSFormsOptions(config);

    expect(config.communicationServicesConnectionString).toBe(process.env.VV_COMMUNICATION_SERVICES_CONNECTION_STRING);
    expect(config.microsoftBookingsUrl).toBe(process.env.VV_MICROSOFT_BOOKINGS_URL);
    expect(config.chatEnabled).toBe(true);
    expect(config.screenShareEnabled).toBe(true);
    expect(config.companyName).toBe(process.env.VV_COMPANY_NAME);
    expect(config.colorPalette).toBe(process.env.VV_COLOR_PALETTE);
    expect(config.waitingTitle).toBe(process.env.VV_WAITING_TITLE);
    expect(config.waitingSubtitle).toBe(process.env.VV_WAITING_SUBTITLE);
    expect(config.logoUrl).toBe(process.env.VV_LOGO_URL);
    expect(config.postCall?.survey.type).toBe(process.env.VV_POSTCALL_SURVEY_TYPE);
    expect(options.surveyUrl).toBe(process.env.VV_POSTCALL_SURVEY_OPTIONS_SURVEYURL);
  });

  test('should use environment variables when available, testing variables for custom post-call survey option ', () => {
    process.env.VV_COMMUNICATION_SERVICES_CONNECTION_STRING = 'MYCONNECTIONSTRING';
    process.env.VV_MICROSOFT_BOOKINGS_URL = 'https://testurl';
    process.env.VV_CHAT_ENABLED = 'True';
    process.env.VV_SCREENSHARE_ENABLED = 'True';
    process.env.VV_COMPANY_NAME = 'Company';
    process.env.VV_COLOR_PALETTE = '#FFFFFF';
    process.env.VV_WAITING_TITLE = 'title';
    process.env.VV_WAITING_SUBTITLE = 'subtitle';
    process.env.VV_LOGO_URL = 'logoUrl';
    process.env.VV_POSTCALL_SURVEY_TYPE = 'custom';
    process.env.VV_POSTCALL_SURVEY_OPTIONS_SURVEYURL = 'customtesturl';

    const config = getConfig.getServerConfig();
    const options: CustomSurveyOptions = getConfig.getCustomSurveyOptions(config);

    expect(config.communicationServicesConnectionString).toBe(process.env.VV_COMMUNICATION_SERVICES_CONNECTION_STRING);
    expect(config.microsoftBookingsUrl).toBe(process.env.VV_MICROSOFT_BOOKINGS_URL);
    expect(config.chatEnabled).toBe(true);
    expect(config.screenShareEnabled).toBe(true);
    expect(config.companyName).toBe(process.env.VV_COMPANY_NAME);
    expect(config.colorPalette).toBe(process.env.VV_COLOR_PALETTE);
    expect(config.waitingTitle).toBe(process.env.VV_WAITING_TITLE);
    expect(config.waitingSubtitle).toBe(process.env.VV_WAITING_SUBTITLE);
    expect(config.logoUrl).toBe(process.env.VV_LOGO_URL);
    expect(config.postCall?.survey.type).toBe(process.env.VV_POSTCALL_SURVEY_TYPE);
    expect(options.surveyUrl).toBe(process.env.VV_POSTCALL_SURVEY_OPTIONS_SURVEYURL);
  });

  test('should use environment variables when available, testing variables for one question poll post-call survey option ', () => {
    process.env.VV_COMMUNICATION_SERVICES_CONNECTION_STRING = 'MYCONNECTIONSTRING';
    process.env.VV_MICROSOFT_BOOKINGS_URL = 'https://testurl';
    process.env.VV_CHAT_ENABLED = 'True';
    process.env.VV_SCREENSHARE_ENABLED = 'True';
    process.env.VV_COMPANY_NAME = 'Company';
    process.env.VV_COLOR_PALETTE = '#FFFFFF';
    process.env.VV_WAITING_TITLE = 'title';
    process.env.VV_WAITING_SUBTITLE = 'subtitle';
    process.env.VV_LOGO_URL = 'logoUrl';
    process.env.VV_POSTCALL_SURVEY_TYPE = 'onequestionpoll';
    process.env.VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_TITLE = 'Customer Satisfaction Survey';
    process.env.VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_PROMPT = 'Were you satisfied with your service?';
    process.env.VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_TYPE = 'likeOrDislike';
    process.env.VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_ANSWER_PLACEHOLDER = 'Great service!';
    process.env.VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_SAVE_BUTTON_TEXT = 'Save';

    const config = getConfig.getServerConfig();
    const options: OneQuestionPollOptions = getConfig.getOneQuestionPollOptions(config);

    expect(config.communicationServicesConnectionString).toBe(process.env.VV_COMMUNICATION_SERVICES_CONNECTION_STRING);
    expect(config.microsoftBookingsUrl).toBe(process.env.VV_MICROSOFT_BOOKINGS_URL);
    expect(config.chatEnabled).toBe(true);
    expect(config.screenShareEnabled).toBe(true);
    expect(config.companyName).toBe(process.env.VV_COMPANY_NAME);
    expect(config.colorPalette).toBe(process.env.VV_COLOR_PALETTE);
    expect(config.waitingTitle).toBe(process.env.VV_WAITING_TITLE);
    expect(config.waitingSubtitle).toBe(process.env.VV_WAITING_SUBTITLE);
    expect(config.logoUrl).toBe(process.env.VV_LOGO_URL);
    expect(config.postCall?.survey.type).toBe(process.env.VV_POSTCALL_SURVEY_TYPE);
    expect(options.title).toBe(process.env.VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_TITLE);
    expect(options.prompt).toBe(process.env.VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_PROMPT);
    expect(options.pollType).toBe(process.env.VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_TYPE);
    expect(options.answerPlaceholder).toBe(process.env.VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_ANSWER_PLACEHOLDER);
    expect(options.saveButtonText).toBe(process.env.VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_SAVE_BUTTON_TEXT);
  });

  test('client config should not contain the connection string', () => {
    const config = getConfig.getServerConfig();
    expect(config.communicationServicesConnectionString).toBeDefined();

    config.communicationServicesConnectionString = 'endpoint=test_endpoint_value;accesskey=secret';
    const clientConfig = getConfig.getClientConfig(config);
    expect(clientConfig.communicationEndpoint).toBe('test_endpoint_value');
  });

  test('server config returns correctly mapped values for MS Forms survey as post-call option', () => {
    const mockDefaultConfig = {
      communicationServicesConnectionString: 'dummy endpoint',
      microsoftBookingsUrl: 'dummyBookingsUrl',
      chatEnabled: true,
      screenShareEnabled: true,
      companyName: 'test Healthcare',
      colorPalette: '#0078d4',
      waitingTitle: 'Thank you for choosing Lamna Healthcare',
      waitingSubtitle: 'Your clinician is joining the meeting',
      logoUrl: '',
      postCall: {
        survey: { type: 'msforms', options: { surveyUrl: 'msFormsSurveyURL' } }
      }
    };
    const getDefaultConfigSpy = jest
      .spyOn(getDefaultConfig, 'getDefaultConfig')
      .mockImplementation((): any => mockDefaultConfig);

    const serverConfig = getConfig.getServerConfig();
    const options: MSFormsSurveyOptions = getConfig.getMSFormsOptions(serverConfig);

    expect(getDefaultConfigSpy).toHaveBeenCalled();
    expect(serverConfig.companyName).toBe('test Healthcare');
    expect(serverConfig.postCall).toBeDefined();
    expect(serverConfig.postCall?.survey).toBeDefined();
    expect(serverConfig.postCall?.survey.type).toBe(mockDefaultConfig.postCall.survey.type);
    expect(serverConfig.postCall?.survey.options).toBeDefined();
    expect(options.surveyUrl).toBe(mockDefaultConfig.postCall.survey.options.surveyUrl);
  });

  test('server config returns correctly mapped values for custom survey as post-call option', () => {
    const mockDefaultConfig = {
      communicationServicesConnectionString: 'dummy endpoint',
      microsoftBookingsUrl: 'dummyBookingsUrl',
      chatEnabled: true,
      screenShareEnabled: true,
      companyName: 'test Healthcare',
      colorPalette: '#0078d4',
      waitingTitle: 'Thank you for choosing Lamna Healthcare',
      waitingSubtitle: 'Your clinician is joining the meeting',
      logoUrl: '',
      postCall: {
        survey: { type: 'custom', options: { surveyUrl: 'customSurveyURL' } }
      }
    };
    const getDefaultConfigSpy = jest
      .spyOn(getDefaultConfig, 'getDefaultConfig')
      .mockImplementation((): any => mockDefaultConfig);

    const serverConfig = getConfig.getServerConfig();
    const options: CustomSurveyOptions = getConfig.getCustomSurveyOptions(serverConfig);

    expect(getDefaultConfigSpy).toHaveBeenCalled();
    expect(serverConfig.companyName).toBe('test Healthcare');
    expect(serverConfig.postCall).toBeDefined();
    expect(serverConfig.postCall?.survey).toBeDefined();
    expect(serverConfig.postCall?.survey.type).toBe(mockDefaultConfig.postCall.survey.type);
    expect(serverConfig.postCall?.survey.options).toBeDefined();
    expect(options.surveyUrl).toBe(mockDefaultConfig.postCall.survey.options.surveyUrl);
  });

  test('server config returns correctly mapped values for one question poll survey as post-call option', () => {
    const mockDefaultConfig = {
      communicationServicesConnectionString: 'dummy endpoint',
      microsoftBookingsUrl: 'dummyBookingsUrl',
      chatEnabled: true,
      screenShareEnabled: true,
      companyName: 'test Healthcare',
      colorPalette: '#0078d4',
      waitingTitle: 'Thank you for choosing Lamna Healthcare',
      waitingSubtitle: 'Your clinician is joining the meeting',
      logoUrl: '',
      postCall: {
        survey: {
          type: 'onequestionpoll',
          options: {
            title: 'Customer Satisfaction Survey',
            prompt: 'Were you satisfied with your service?',
            pollType: 'likeOrDislike',
            answerPlaceholder: 'Great service!',
            saveButtonText: 'Save'
          }
        }
      }
    };
    const getDefaultConfigSpy = jest
      .spyOn(getDefaultConfig, 'getDefaultConfig')
      .mockImplementation((): any => mockDefaultConfig);

    const serverConfig = getConfig.getServerConfig();
    const options: OneQuestionPollOptions = getConfig.getOneQuestionPollOptions(serverConfig);

    expect(getDefaultConfigSpy).toHaveBeenCalled();
    expect(serverConfig.companyName).toBe('test Healthcare');
    expect(serverConfig.postCall).toBeDefined();
    expect(serverConfig.postCall?.survey).toBeDefined();
    expect(serverConfig.postCall?.survey.type).toBe(mockDefaultConfig.postCall.survey.type);
    expect(serverConfig.postCall?.survey.options).toBeDefined();
    expect(options.title).toBe(mockDefaultConfig.postCall.survey.options.title);
    expect(options.prompt).toBe(mockDefaultConfig.postCall.survey.options.prompt);
    expect(options.pollType).toBe(mockDefaultConfig.postCall.survey.options.pollType);
    expect(options.answerPlaceholder).toBe(mockDefaultConfig.postCall.survey.options.answerPlaceholder);
    expect(options.saveButtonText).toBe(mockDefaultConfig.postCall.survey.options.saveButtonText);
  });

  test('getServerConfig returns undefined when postCallSurveyType is invalid', () => {
    const mockDefaultConfig = {
      communicationServicesConnectionString: 'dummy endpoint',
      microsoftBookingsUrl: 'dummyBookingsUrl',
      chatEnabled: true,
      screenShareEnabled: true,
      companyName: 'test Healthcare',
      colorPalette: '#0078d4',
      waitingTitle: 'Thank you for choosing Lamna Healthcare',
      waitingSubtitle: 'Your clinician is joining the meeting',
      logoUrl: '',
      postCall: {
        survey: { type: 'randomtype', options: { surveyUrl: 'customSurveyURL' } }
      }
    };
    const getDefaultConfigSpy = jest
      .spyOn(getDefaultConfig, 'getDefaultConfig')
      .mockImplementation((): any => mockDefaultConfig);

    const config = getConfig.getServerConfig();
    expect(getDefaultConfigSpy).toHaveBeenCalled();
    expect(config.postCall).not.toBeDefined();
  });
});
