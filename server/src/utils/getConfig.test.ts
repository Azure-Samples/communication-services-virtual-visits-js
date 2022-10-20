// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as getConfig from './getConfig';
import * as getDefaultConfig from './getDefaultConfig';
import * as getPostCallConfig from './getPostCallConfig';
import * as getCosmosDbConfig from './getCosmosDbConfig';

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
    delete process.env.VV_COSMOS_DB_CONNECTION_STRING;
    delete process.env.VV_COSMOS_DB_NAME;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should use defaultConfig.json values if environment variables are not defined', () => {
    const mockDefaultConfig = {
      communicationServicesConnectionString: 'test endpoint',
      microsoftBookingsUrl: 'https://example.org',
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
            title: 'Tell us how we did',
            prompt: `How satisfied are you with this virtual appointment's audio and video quality?`,
            pollType: 'likeOrDislike',
            saveButtonText: 'Continue'
          }
        }
      },
      cosmosDb: {
        connectionString: 'cosmosConnectionString',
        dbName: 'cosmosDbName'
      }
    };
    const getDefaultConfigSpy = jest
      .spyOn(getDefaultConfig, 'getDefaultConfig')
      .mockImplementation((): any => mockDefaultConfig);

    const postCallConfigSpy = jest.spyOn(getPostCallConfig, 'default');
    const cosmosDbConfigSpy = jest.spyOn(getCosmosDbConfig, 'default');

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
    expect(config.postCall).toBeDefined();
    expect(config.postCall).toEqual(mockDefaultConfig.postCall);
    expect(postCallConfigSpy).toHaveBeenCalled();
    expect(cosmosDbConfigSpy).toHaveBeenCalled();
    expect(config.cosmosDb).toBeDefined();
    expect(config.cosmosDb).toEqual(mockDefaultConfig.cosmosDb);
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

    const postCallConfigSpy = jest.spyOn(getPostCallConfig, 'default');
    const cosmosDbConfigSpy = jest.spyOn(getCosmosDbConfig, 'default');

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
    expect(postCallConfigSpy).toHaveBeenCalled();
    expect(cosmosDbConfigSpy).toHaveBeenCalled();
  });

  test('client config should not contain the connection string', () => {
    const config = getConfig.getServerConfig();
    expect(config.communicationServicesConnectionString).toBeDefined();

    config.communicationServicesConnectionString = 'endpoint=test_endpoint_value;accesskey=secret';
    const clientConfig = getConfig.getClientConfig(config);
    expect(clientConfig.communicationEndpoint).toBe('test_endpoint_value');
  });
});
