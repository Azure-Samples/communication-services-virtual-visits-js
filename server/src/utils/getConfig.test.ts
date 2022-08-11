// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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

  test('should use environment variables when available', () => {
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

    expect(config.communicationServicesConnectionString).toBe(process.env.VV_COMMUNICATION_SERVICES_CONNECTION_STRING);
    expect(config.microsoftBookingsUrl).toBe(process.env.VV_MICROSOFT_BOOKINGS_URL);
    expect(config.chatEnabled).toBe(true);
    expect(config.screenShareEnabled).toBe(true);
    expect(config.companyName).toBe(process.env.VV_COMPANY_NAME);
    expect(config.colorPalette).toBe(process.env.VV_COLOR_PALETTE);
    expect(config.waitingTitle).toBe(process.env.VV_WAITING_TITLE);
    expect(config.waitingSubtitle).toBe(process.env.VV_WAITING_SUBTITLE);
    expect(config.logoUrl).toBe(process.env.VV_LOGO_URL);
    expect(config.postCall?.survey?.type).toBe(process.env.VV_POSTCALL_SURVEY_TYPE);
    expect(config.postCall?.survey?.options?.surveyUrl).toBe(process.env.VV_POSTCALL_SURVEY_OPTIONS_SURVEYURL);
  });

  test('client config should not contain the connection string', () => {
    const config = getConfig.getServerConfig();
    expect(config.communicationServicesConnectionString).toBeDefined();

    config.communicationServicesConnectionString = 'endpoint=test_endpoint_value;accesskey=secret';
    const clientConfig = getConfig.getClientConfig(config);
    expect(clientConfig.communicationEndpoint).toBe('test_endpoint_value');
  });

  test('client config returns correctly mapped values for a specific postCall option', () => {
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
    serverConfig.communicationServicesConnectionString = 'endpoint=test_endpoint_value;accesskey=secret';
    const clientConfig = getConfig.getClientConfig(serverConfig);

    expect(getDefaultConfigSpy).toHaveBeenCalled();
    expect(clientConfig.companyName).toBe('test Healthcare');
    expect(clientConfig.postCall).toBeDefined();
    expect(clientConfig.postCall?.survey).toBeDefined();
    expect(clientConfig.postCall?.survey?.type).toBe(mockDefaultConfig.postCall.survey.type);
    expect(clientConfig.postCall?.survey?.options).toBeDefined();
    expect(clientConfig.postCall?.survey?.options?.surveyUrl).toBe(mockDefaultConfig.postCall.survey.options.surveyUrl);
  });

  test('getServerConfig returns correctly mapped values for a specific postcall option', () => {
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
        survey: { type: 'thirdparty', options: { surveyUrl: 'thirdpartySurveyURL' } }
      }
    };
    const getDefaultConfigSpy = jest
      .spyOn(getDefaultConfig, 'getDefaultConfig')
      .mockImplementation((): any => mockDefaultConfig);

    const config = getConfig.getServerConfig();
    expect(getDefaultConfigSpy).toHaveBeenCalled();
    expect(config.postCall).toBeDefined();
    expect(config.postCall?.survey).toBeDefined();
    expect(config.postCall?.survey?.type).toBe(mockDefaultConfig.postCall.survey.type);
    expect(config.postCall?.survey?.options).toBeDefined();
    expect(config.postCall?.survey?.options?.surveyUrl).toBe(mockDefaultConfig.postCall.survey.options.surveyUrl);
  });

  test('getServerConfig returns empty postcall object when postCallSurveyType is invalid', () => {
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
        survey: { type: 'randomtype', options: { surveyUrl: 'thirdpartySurveyURL' } }
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
