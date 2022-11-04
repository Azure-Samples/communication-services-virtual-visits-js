// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as Cosmos from '@azure/cosmos';
import SurveyDBHandler, { createSurveyDBHandler } from './surveyDBHandler';
import { ServerConfigModel } from '../models/configModel';

const cosmosDBConfig = {
  connectionString: 'AccountEndpoint=https://example.org/;AccountKey=testingAccountKey',
  dbName: 'testingDbName'
};

describe('Test surveyDBHandler', () => {
  describe('init', () => {
    it('initializes database and container', async () => {
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
  });

  describe('saveSurveyResult', () => {
    it('calls upsert to save the result', async () => {
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
  });
});

describe('createSurveyDBHandler', () => {
  it('returns undefined if postCall is undefined', () => {
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

  it('returns undefined if postCall is defined and post call survey type is not onequestionpoll', () => {
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

  it('returns undefined if postCall is defined, post call survey type is onequestionpoll, and cosmosDb is undefined', () => {
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

  it('returns undefined if initializing CosmosClient fails', () => {
    const invalidCosmosConnectionString = 'my invalid connection string!';
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
        connectionString: invalidCosmosConnectionString,
        dbName: 'testingDBName'
      }
    };

    const mockError = 'CosmosClient error!';
    const cosmosSpy = jest.spyOn(Cosmos, 'CosmosClient').mockImplementation(() => {
      throw new Error(mockError);
    });

    const surveyDBHandler = createSurveyDBHandler(config as ServerConfigModel);

    expect(surveyDBHandler).toBeUndefined();
    expect(cosmosSpy).toThrow(mockError);
  });

  it('returns surveyDBHandler if config is valid', () => {
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
});
