// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getServerConfig, getClientConfig } from './getConfig';
import DefaultConfig from '../defaultConfig.json';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('config', () => {
  test('should use defaultConfig.json values if environment variables are not defined', () => {
    delete process.env.VV_COMMUNICATION_SERVICES_CONNECTION_STRING;
    delete process.env.VV_MICROSOFT_BOOKINGS_URL;
    delete process.env.VV_CHAT_ENABLED;
    delete process.env.VV_SCREENSHARE_ENABLED;
    delete process.env.VV_COMPANY_NAME;
    delete process.env.VV_COLOR_PALETTE;
    delete process.env.VV_WAITING_TITLE;
    delete process.env.VV_WAITING_SUBTITLE;

    const config = getServerConfig();

    expect(config.communicationServicesConnectionString).toBe(DefaultConfig.communicationServicesConnectionString);
    expect(config.microsoftBookingsUrl).toBe(DefaultConfig.microsoftBookingsUrl);
    expect(config.chatEnabled).toBe(DefaultConfig.chatEnabled);
    expect(config.screenShareEnabled).toBe(DefaultConfig.screenShareEnabled);
    expect(config.companyName).toBe(DefaultConfig.companyName);
    expect(config.colorPalette).toBe(DefaultConfig.colorPalette);
    expect(config.waitingTitle).toBe(DefaultConfig.waitingTitle);
    expect(config.waitingSubtitle).toBe(DefaultConfig.waitingSubtitle);
    if (config.postCall?.survey?.type !== undefined) {
      expect(config.postCall?.survey?.type).toBe(DefaultConfig.postCall.survey.type);
      expect(config.postCall?.survey?.options?.surveyUrl).toBe(DefaultConfig.postCall.survey.options.surveyUrl);
    }
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

    const config = getServerConfig();

    expect(config.communicationServicesConnectionString).toBe(process.env.VV_COMMUNICATION_SERVICES_CONNECTION_STRING);
    expect(config.microsoftBookingsUrl).toBe(process.env.VV_MICROSOFT_BOOKINGS_URL);
    expect(config.chatEnabled).toBe(true);
    expect(config.screenShareEnabled).toBe(true);
    expect(config.companyName).toBe(process.env.VV_COMPANY_NAME);
    expect(config.colorPalette).toBe(process.env.VV_COLOR_PALETTE);
    expect(config.waitingTitle).toBe(process.env.VV_WAITING_TITLE);
    expect(config.waitingSubtitle).toBe(process.env.VV_WAITING_SUBTITLE);
  });

  test('client config should not contain the connection string', () => {
    const config = getServerConfig();
    expect(config.communicationServicesConnectionString).toBeDefined();

    config.communicationServicesConnectionString = 'endpoint=test_endpoint_value;accesskey=secret';
    const clientConfig = getClientConfig(config);
    expect(clientConfig.communicationEndpoint).toBe('test_endpoint_value');
  });

  test('getServerConfig returns empty postCall object if "none" is selected', () => {
    jest.mock(
      '../defaultConfig.json',
      () => ({
        communicationServicesConnectionString: 'dummy endpoint',
        microsoftBookingsUrl: 'dummyBookingsUrl',
        chatEnabled: true,
        screenShareEnabled: true,
        companyName: 'test Healthcare',
        colorPalette: '#0078d4',
        waitingTitle: 'Thank you for choosing Lamna Healthcare',
        waitingSubtitle: 'Your clinician is joining the meeting',
        logoUrl: ''
      }),
      { virtual: true }
    );

    delete process.env.VV_COMMUNICATION_SERVICES_CONNECTION_STRING;
    delete process.env.VV_MICROSOFT_BOOKINGS_URL;
    delete process.env.VV_CHAT_ENABLED;
    delete process.env.VV_SCREENSHARE_ENABLED;
    delete process.env.VV_COMPANY_NAME;
    delete process.env.VV_COLOR_PALETTE;
    delete process.env.VV_WAITING_TITLE;
    delete process.env.VV_WAITING_SUBTITLE;
    const config = getServerConfig();
    expect(config.companyName).toBe('test Healthcare');
    expect(config.postCall).toBeUndefined();
  });

  test('getServerConfig returns correctly mapped values for "msforms" option', () => {
    jest.mock('../defaultConfig.json', () => {
      return jest.fn().mockImplementation(() => {
        return {
          communicationServicesConnectionString: 'dummy endpoint',
          microsoftBookingsUrl: 'dummyBookingsUrl',
          chatEnabled: true,
          screenShareEnabled: true,
          companyName: 'Lamna Healthcare',
          colorPalette: '#0078d4',
          waitingTitle: 'Thank you for choosing Lamna Healthcare',
          waitingSubtitle: 'Your clinician is joining the meeting',
          logoUrl: '',
          postCall: {
            survey: { type: 'msforms', options: { surveyUrl: 'msFormsSurveyURL' } }
          }
        };
      });
    });
    const config = getServerConfig();
    console.log(config);
    console.log(DefaultConfig);
    expect(config.chatEnabled).toBe(DefaultConfig.chatEnabled);
    expect(config.postCall).toBeDefined();
    expect(config.postCall?.survey).toBeDefined();
    expect(config.postCall?.survey?.type).toBe('msforms');
    expect(config.postCall?.survey?.options).toBeDefined();
    expect(config.postCall?.survey?.options?.surveyUrl).toBe('msFormsSurveyURL');
  });
});
