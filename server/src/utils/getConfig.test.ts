// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as getConfig from './getConfig';

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

    const config = getConfig.getServerConfig();
    const defaultConfigObj: any = getConfig.getDefaultConfig();

    expect(config.communicationServicesConnectionString).toBe(defaultConfigObj.communicationServicesConnectionString);
    expect(config.microsoftBookingsUrl).toBe(defaultConfigObj.microsoftBookingsUrl);
    expect(config.chatEnabled).toBe(defaultConfigObj.chatEnabled);
    expect(config.screenShareEnabled).toBe(defaultConfigObj.screenShareEnabled);
    expect(config.companyName).toBe(defaultConfigObj.companyName);
    expect(config.colorPalette).toBe(defaultConfigObj.colorPalette);
    expect(config.waitingTitle).toBe(defaultConfigObj.waitingTitle);
    expect(config.waitingSubtitle).toBe(defaultConfigObj.waitingSubtitle);
    if (config.postCall?.survey?.type !== undefined) {
      expect(config.postCall?.survey?.type).toBe(defaultConfigObj.postCall?.survey.type);
      expect(config.postCall?.survey?.options?.surveyUrl).toBe(defaultConfigObj.postCall?.survey.options.surveyUrl);
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

    const config = getConfig.getServerConfig();

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
    const config = getConfig.getServerConfig();
    expect(config.communicationServicesConnectionString).toBeDefined();

    config.communicationServicesConnectionString = 'endpoint=test_endpoint_value;accesskey=secret';
    const clientConfig = getConfig.getClientConfig(config);
    expect(clientConfig.communicationEndpoint).toBe('test_endpoint_value');
  });

  test('client config returns correctly mapped values for "msforms" option', () => {
    const spy = jest.spyOn(getConfig, 'getDefaultConfig');
    const mockValue = {
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
    spy.mockReturnValue(mockValue);

    delete process.env.VV_COMMUNICATION_SERVICES_CONNECTION_STRING;
    delete process.env.VV_MICROSOFT_BOOKINGS_URL;
    delete process.env.VV_CHAT_ENABLED;
    delete process.env.VV_SCREENSHARE_ENABLED;
    delete process.env.VV_COMPANY_NAME;
    delete process.env.VV_COLOR_PALETTE;
    delete process.env.VV_WAITING_TITLE;
    delete process.env.VV_WAITING_SUBTITLE;

    const serverConfig = getConfig.getServerConfig();
    serverConfig.communicationServicesConnectionString = 'endpoint=test_endpoint_value;accesskey=secret';
    const clientConfig = getConfig.getClientConfig(serverConfig);
    expect(clientConfig.companyName).toBe('test Healthcare');
    expect(clientConfig.postCall).toBeDefined();
    expect(clientConfig.postCall?.survey).toBeDefined();
    expect(clientConfig.postCall?.survey?.type).toBe('msforms');
    expect(clientConfig.postCall?.survey?.options).toBeDefined();
    expect(clientConfig.postCall?.survey?.options?.surveyUrl).toBe('msFormsSurveyURL');
  });

  test('getServerConfig returns postCall object with survey type "none" if "none" is selected', () => {
    const spy = jest.spyOn(getConfig, 'getDefaultConfig');
    const mockValue = {
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
        survey: { type: 'none', options: { surveyUrl: '' } }
      }
    };
    spy.mockReturnValue(mockValue);

    const config = getConfig.getServerConfig();
    expect(config.companyName).toBe('test Healthcare');
    expect(config.postCall).toBeDefined();
    expect(config.postCall?.survey).toBeDefined();
    expect(config.postCall?.survey?.type).toBe('none');
    expect(config.postCall?.survey?.options).toBeDefined();
    expect(config.postCall?.survey?.options?.surveyUrl).toBe('');
  });

  test('getServerConfig returns correctly mapped values for "msforms" option', () => {
    const spy = jest.spyOn(getConfig, 'getDefaultConfig');
    const mockValue = {
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
    spy.mockReturnValue(mockValue);

    const config = getConfig.getServerConfig();
    expect(config.postCall).toBeDefined();
    expect(config.postCall?.survey).toBeDefined();
    expect(config.postCall?.survey?.type).toBe('msforms');
    expect(config.postCall?.survey?.options).toBeDefined();
    expect(config.postCall?.survey?.options?.surveyUrl).toBe('msFormsSurveyURL');
  });
});
