// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getServerConfig } from '../../utils/getConfig';
import SurveyDBHandler from './surveyDBHandler';

describe('Test surveyDBHandler', () => {
  beforeEach(() => {
    process.env.VV_COSMOS_DB_ENDPOINT = 'https://testinghost/';
  });

  afterEach(() => {
    delete process.env.VV_COSMOS_DB_ENDPOINT;
  });

  test('Test init', async () => {
    const config = getServerConfig();
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

    if (config.cosmosDb) {
      const surveyDBHandler = new SurveyDBHandler(mockedCosmosClient as any, config.cosmosDb);
      await surveyDBHandler.init();

      expect(mockedCosmosClient.databases.createIfNotExists).toHaveBeenCalled();
      expect(mockedCreateIfNotExists).toHaveBeenCalled();
    } else {
      expect(config.cosmosDb).toBeUndefined();
    }
  });

  test('Test saveSurveyResult', async () => {
    const inputData: any = {
      sessionId: 'test_session_id',
      callId: 'test_call_id',
      acsUserId: 'test_acs_user_id',
      response: true
    };
    const config = getServerConfig();
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

    if (config.cosmosDb) {
      const surveyDBHandler = new SurveyDBHandler(mockedCosmosClient as any, config.cosmosDb);

      surveyDBHandler.saveSurveyResult(inputData);

      expect(mockedUpsert).toHaveBeenCalled();
    } else {
      expect(config.cosmosDb).toBeUndefined();
    }
  });
});
