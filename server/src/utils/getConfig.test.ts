// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as getConfig from './getConfig';
import * as getDefaultConfig from './getDefaultConfig';
import { ServerConfigModel } from '../models/configModel';

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
    delete process.env.VV_POSTCALL_CONFIG_ENV_NAME;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should use defaultConfig values if environment variables are not defined', () => {
    const mockDefaultConfig: ServerConfigModel = {
      communicationServicesConnectionString: 'dummy endpoint',
      microsoftBookingsUrl: 'dummyBookingsUrl',
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
      .mockImplementation((): ServerConfigModel => mockDefaultConfig);

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
    expect(config.postCall).toBe(mockDefaultConfig.postCall);
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

  test('should set postCall as undefined if postCall not found in default config', () => {
    const getDefaultConfigSpy = jest.spyOn(getDefaultConfig, 'getDefaultConfig').mockImplementation(
      (): ServerConfigModel => {
        return {
          communicationServicesConnectionString: 'dummy endpoint',
          microsoftBookingsUrl: 'dummyBookingsUrl',
          chatEnabled: true,
          screenShareEnabled: true,
          companyName: 'test Healthcare',
          colorPalette: '#0078d4',
          waitingTitle: 'Thank you for choosing Lamna Healthcare',
          waitingSubtitle: 'Your clinician is joining the meeting',
          logoUrl: ''
        };
      }
    );

    const config = getConfig.getServerConfig();
    expect(getDefaultConfigSpy).toHaveBeenCalled();
    expect(config.postCall).not.toBeDefined();
  });

  test('should allow null value for postCall', () => {
    const getDefaultConfigSpy = jest.spyOn(getDefaultConfig, 'getDefaultConfig').mockImplementation(
      (): ServerConfigModel => {
        return {
          communicationServicesConnectionString: 'dummy endpoint',
          microsoftBookingsUrl: 'dummyBookingsUrl',
          chatEnabled: true,
          screenShareEnabled: true,
          companyName: 'test Healthcare',
          colorPalette: '#0078d4',
          waitingTitle: 'Thank you for choosing Lamna Healthcare',
          waitingSubtitle: 'Your clinician is joining the meeting',
          logoUrl: '',
          postCall: null
        };
      }
    );

    const config = getConfig.getServerConfig();
    expect(getDefaultConfigSpy).toHaveBeenCalled();
    expect(config.postCall).toBe(null);
  });

  test('should return correctly mapped values for postcall "msforms" option', () => {
    const getDefaultConfigSpy = jest.spyOn(getDefaultConfig, 'getDefaultConfig').mockImplementation(
      (): ServerConfigModel => {
        return {
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
      }
    );

    const serverConfig = getConfig.getServerConfig();
    expect(getDefaultConfigSpy).toHaveBeenCalled();
    expect(serverConfig.postCall).toBeDefined();
    expect(serverConfig.postCall?.survey).toBeDefined();
    expect(serverConfig.postCall?.survey?.type).toBe('msforms');
    expect(serverConfig.postCall?.survey?.options).toBeDefined();
    expect(serverConfig.postCall?.survey?.options?.surveyUrl).toBe('msFormsSurveyURL');
  });

  test('should return correctly mapped values for postcall "thirdparty" option', () => {
    const getDefaultConfigSpy = jest.spyOn(getDefaultConfig, 'getDefaultConfig').mockImplementation(
      (): ServerConfigModel => {
        return {
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
      }
    );

    const serverConfig = getConfig.getServerConfig();
    expect(getDefaultConfigSpy).toHaveBeenCalled();
    expect(serverConfig.postCall).toBeDefined();
    expect(serverConfig.postCall?.survey).toBeDefined();
    expect(serverConfig.postCall?.survey?.type).toBe('thirdparty');
    expect(serverConfig.postCall?.survey?.options).toBeDefined();
    expect(serverConfig.postCall?.survey?.options?.surveyUrl).toBe('thirdpartySurveyURL');
  });

  test('client config should not contain the connection string', () => {
    const config = getConfig.getServerConfig();
    expect(config.communicationServicesConnectionString).toBeDefined();

    config.communicationServicesConnectionString = 'endpoint=test_endpoint_value;accesskey=secret';
    const clientConfig = getConfig.getClientConfig(config);
    expect(clientConfig.communicationEndpoint).toBe('test_endpoint_value');
  });
});
