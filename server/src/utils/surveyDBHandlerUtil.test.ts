// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ServerConfigModel } from '../models/configModel';
import { createSurveyDBHandler } from './surveyDBHandlerUtil';

describe('Test surveyDBHandlerUtil', () => {
  test('Test createSurveyDBHandler with no postCall and cosmosDb', () => {
    const config = {
      communicationServicesConnectionString: 'endpoint=your_endpoint;accesskey=secret',
      microsoftBookingsUrl: 'https://testBookingsUrl',
      chatEnabled: true,
      screenShareEnabled: true,
      companyName: 'Lamna Healthcare',
      colorPalette: '#0078d4',
      waitingTitle: 'Thank you for choosing Lamna Healthcare',
      waitingSubtitle: 'Your clinician is joining the meeting',
      logoUrl: ''
    };

    const surveyDBHandler = createSurveyDBHandler(config);

    expect(surveyDBHandler).toBeUndefined();
  });

  test('Test createSurveyDBHandler with postCall and cosmosDb exists', () => {
    const config = {
      communicationServicesConnectionString: 'endpoint=your_endpoint;accesskey=secret',
      microsoftBookingsUrl: 'https://testBookingsUrl',
      chatEnabled: true,
      screenShareEnabled: true,
      companyName: 'Lamna Healthcare',
      colorPalette: '#0078d4',
      waitingTitle: 'Thank you for choosing Lamna Healthcare',
      waitingSubtitle: 'Your clinician is joining the meeting',
      logoUrl: '',
      postCall: {
        survey: {
          type: 'onequestionpoll',
          options: {
            prompt: 'testing prompt',
            pollType: 'likeOrDislike',
            saveButtonText: 'like or dislike'
          }
        }
      },
      cosmosDb: {
        endpoint: 'http://testinghost.com',
        dbName: 'testingDBName'
      }
    };

    const surveyDBHandler = createSurveyDBHandler(config as ServerConfigModel);

    expect(surveyDBHandler).not.toBeUndefined();
  });

  test('Test createSurveyDBHandler with only postCall exists', () => {
    const config = {
      communicationServicesConnectionString: 'endpoint=your_endpoint;accesskey=secret',
      microsoftBookingsUrl: 'https://testBookingsUrl',
      chatEnabled: true,
      screenShareEnabled: true,
      companyName: 'Lamna Healthcare',
      colorPalette: '#0078d4',
      waitingTitle: 'Thank you for choosing Lamna Healthcare',
      waitingSubtitle: 'Your clinician is joining the meeting',
      logoUrl: '',
      postCall: {
        survey: {
          type: 'onequestionpoll',
          options: {
            prompt: 'testing prompt',
            pollType: 'likeOrDislike',
            saveButtonText: 'like or dislike'
          }
        }
      }
    };

    const surveyDBHandler = createSurveyDBHandler(config as ServerConfigModel);

    expect(surveyDBHandler).toBeUndefined();
  });

  test('Test createSurveyDBHandler with cosmosDb connectionString exists', () => {
    const config = {
      communicationServicesConnectionString: 'endpoint=your_endpoint;accesskey=secret',
      microsoftBookingsUrl: 'https://testBookingsUrl',
      chatEnabled: true,
      screenShareEnabled: true,
      companyName: 'Lamna Healthcare',
      colorPalette: '#0078d4',
      waitingTitle: 'Thank you for choosing Lamna Healthcare',
      waitingSubtitle: 'Your clinician is joining the meeting',
      logoUrl: '',
      postCall: {
        survey: {
          type: 'onequestionpoll',
          options: {
            prompt: 'testing prompt',
            pollType: 'likeOrDislike',
            saveButtonText: 'like or dislike'
          }
        }
      },
      cosmosDb: {
        connectionString: 'AccountEndpoint=https://testing.com/;AccountKey=testingAccountKey',
        dbName: 'testingDBName'
      }
    };

    const surveyDBHandler = createSurveyDBHandler(config as ServerConfigModel);

    expect(surveyDBHandler).not.toBeUndefined();
  });

  test('Test createSurveyDBHandler with cosmosDb connectionString with empty', () => {
    const config = {
      communicationServicesConnectionString: 'endpoint=your_endpoint;accesskey=secret',
      microsoftBookingsUrl: 'https://testBookingsUrl',
      chatEnabled: true,
      screenShareEnabled: true,
      companyName: 'Lamna Healthcare',
      colorPalette: '#0078d4',
      waitingTitle: 'Thank you for choosing Lamna Healthcare',
      waitingSubtitle: 'Your clinician is joining the meeting',
      logoUrl: '',
      postCall: {
        survey: {
          type: 'onequestionpoll',
          options: {
            prompt: 'testing prompt',
            pollType: 'likeOrDislike',
            saveButtonText: 'like or dislike'
          }
        }
      },
      cosmosDb: {
        connectionString: '',
        dbName: 'testingDBName'
      }
    };

    try {
      createSurveyDBHandler(config as ServerConfigModel);
    } catch (e) {
      expect(createSurveyDBHandler).toThrowError();
    }
  });

  test('Test createSurveyDBHandler with survey type not onequestionpoll', () => {
    const config = {
      communicationServicesConnectionString: 'endpoint=your_endpoint;accesskey=secret',
      microsoftBookingsUrl: 'https://testBookingsUrl',
      chatEnabled: true,
      screenShareEnabled: true,
      companyName: 'Lamna Healthcare',
      colorPalette: '#0078d4',
      waitingTitle: 'Thank you for choosing Lamna Healthcare',
      waitingSubtitle: 'Your clinician is joining the meeting',
      logoUrl: '',
      postCall: {
        survey: {
          type: 'somethingelse',
          options: {
            prompt: 'testing prompt',
            pollType: 'likeOrDislike',
            saveButtonText: 'like or dislike'
          }
        }
      },
      cosmosDb: {
        connectionString: 'AccountEndpoint=https://testing.com/;AccountKey=testingAccountKey',
        dbName: 'testingDBName'
      }
    };

    const surveyDBHandler = createSurveyDBHandler(config as ServerConfigModel);

    expect(surveyDBHandler).toBeUndefined();
  });

  test('Test createSurveyDBHandler with ony cosmosDb exists', () => {
    const config = {
      communicationServicesConnectionString: 'endpoint=your_endpoint;accesskey=secret',
      microsoftBookingsUrl: 'https://testBookingsUrl',
      chatEnabled: true,
      screenShareEnabled: true,
      companyName: 'Lamna Healthcare',
      colorPalette: '#0078d4',
      waitingTitle: 'Thank you for choosing Lamna Healthcare',
      waitingSubtitle: 'Your clinician is joining the meeting',
      logoUrl: '',
      cosmosDb: {
        endpoint: 'http://testinghost.com',
        dbName: 'testingDBName'
      }
    };

    const surveyDBHandler = createSurveyDBHandler(config);

    expect(surveyDBHandler).toBeUndefined();
  });
});
