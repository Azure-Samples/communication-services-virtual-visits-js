// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import SurveyDBHandler, { createSurveyDBHandler } from './surveyDBHandler';
import { ServerConfigModel } from '../models/configModel';

const cosmosDBConfig = {
  endpoint: 'https://example.org',
  dbName: 'testingDbName'
};

describe('Test surveyDBHandler', () => {
  test('Test init', async () => {
    const mockedCreateIfNotExists = jest.fn();
    const mockedCosmosClient = {
      databases: {
        createIfNotExists: jest.fn()
      },
      database: jest.fn().mockImplementation(() => {
        return {
          containers: {
            createIfNotExists: mockedCreateIfNotExists
          }
        };
      })
    };

    const surveyDBHandler = new SurveyDBHandler(mockedCosmosClient as any, cosmosDBConfig);
    await surveyDBHandler.init();

    expect(mockedCosmosClient.databases.createIfNotExists).toHaveBeenCalled();
    expect(mockedCreateIfNotExists).toHaveBeenCalled();
  });

  test('Test saveSurveyResult', async () => {
    const inputData: any = {
      callId: 'test_call_id',
      acsUserId: 'test_acs_user_id',
      response: true
    };
    const mockedUpsert = jest.fn();
    const mockedCosmosClient = {
      database: jest.fn().mockImplementation(() => {
        return {
          container: jest.fn().mockImplementation(() => {
            return {
              items: {
                upsert: mockedUpsert
              }
            };
          })
        };
      })
    };

    const surveyDBHandler = new SurveyDBHandler(mockedCosmosClient as any, cosmosDBConfig);
    surveyDBHandler.saveSurveyResult(inputData);

    expect(mockedUpsert).toHaveBeenCalled();
  });

  test('Test querySurvey no duplicate survey', async () => {
    const callId = 'test_call_id';
    const acsUserId = 'test_acs_user_id';
    const mockedFetchAll = jest.fn().mockImplementationOnce(() => ({ resources: [] }));
    const mockedCosmosClient = {
      database: jest.fn().mockImplementation(() => {
        return {
          container: jest.fn().mockImplementation(() => {
            return {
              items: {
                upsert: jest.fn(),
                query: jest.fn().mockImplementation(() => {
                  return {
                    fetchAll: mockedFetchAll
                  };
                })
              }
            };
          })
        };
      })
    };

    const surveyDBHandler = new SurveyDBHandler(mockedCosmosClient as any, cosmosDBConfig);
    const results = await surveyDBHandler.querySurvey(callId, acsUserId);

    expect(mockedFetchAll).toHaveBeenCalled();
    expect(results.length).toEqual(0);
  });

  test('Test querySurvey duplicate survey', async () => {
    const invalidInput = {
      callId: 'test_call_id',
      acsUserId: 'test_acs_user_id',
      response: true
    };
    const mockedFetchAll = jest.fn().mockImplementationOnce(() => ({ resources: [{ ...invalidInput }] }));
    const mockedCosmosClient = {
      database: jest.fn().mockImplementation(() => {
        return {
          container: jest.fn().mockImplementation(() => {
            return {
              items: {
                upsert: jest.fn(),
                query: jest.fn().mockImplementation(() => {
                  return {
                    fetchAll: mockedFetchAll
                  };
                })
              }
            };
          })
        };
      })
    };

    const surveyDBHandler = new SurveyDBHandler(mockedCosmosClient as any, cosmosDBConfig);
    const results = await surveyDBHandler.querySurvey(invalidInput.callId, invalidInput.acsUserId);

    expect(mockedFetchAll).toHaveBeenCalled();
    expect(results.length).not.toEqual(0);
  });
});

describe('Test createSurveyDBHandler', () => {
  test('Test createSurveyDBHandler with no postCall and cosmosDb', () => {
    const config = {
      communicationServicesConnectionString: 'endpoint=your_endpoint;accesskey=secret',
      microsoftBookingsUrl: 'https://example.org',
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
      microsoftBookingsUrl: 'https://example.org',
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
        endpoint: 'http://example.org',
        dbName: 'testingDBName'
      }
    };

    const surveyDBHandler = createSurveyDBHandler(config as ServerConfigModel);

    expect(surveyDBHandler).toBeDefined();
  });

  test('Test createSurveyDBHandler with only postCall exists', () => {
    const config = {
      communicationServicesConnectionString: 'endpoint=your_endpoint;accesskey=secret',
      microsoftBookingsUrl: 'https://example.org',
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
      microsoftBookingsUrl: 'https://example.org',
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
        connectionString: 'AccountEndpoint=https://example.org/;AccountKey=testingAccountKey',
        dbName: 'testingDBName'
      }
    };

    const surveyDBHandler = createSurveyDBHandler(config as ServerConfigModel);

    expect(surveyDBHandler).toBeDefined();
  });

  test('Test createSurveyDBHandler with cosmosDb connectionString with empty', () => {
    const config = {
      communicationServicesConnectionString: 'endpoint=your_endpoint;accesskey=secret',
      microsoftBookingsUrl: 'https://example.org',
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
      microsoftBookingsUrl: 'https://example.org',
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
        connectionString: 'AccountEndpoint=https://example.org/;AccountKey=testingAccountKey',
        dbName: 'testingDBName'
      }
    };

    const surveyDBHandler = createSurveyDBHandler(config as ServerConfigModel);

    expect(surveyDBHandler).toBeUndefined();
  });

  test('Test createSurveyDBHandler with ony cosmosDb exists', () => {
    const config = {
      communicationServicesConnectionString: 'endpoint=your_endpoint;accesskey=secret',
      microsoftBookingsUrl: 'https://example.org',
      chatEnabled: true,
      screenShareEnabled: true,
      companyName: 'Lamna Healthcare',
      colorPalette: '#0078d4',
      waitingTitle: 'Thank you for choosing Lamna Healthcare',
      waitingSubtitle: 'Your clinician is joining the meeting',
      logoUrl: '',
      cosmosDb: {
        endpoint: 'http://example.org',
        dbName: 'testingDBName'
      }
    };

    const surveyDBHandler = createSurveyDBHandler(config);

    expect(surveyDBHandler).toBeUndefined();
  });
});
