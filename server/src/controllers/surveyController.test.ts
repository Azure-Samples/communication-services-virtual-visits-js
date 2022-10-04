// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Items } from '@azure/cosmos';
import SurveyDBHandler from '../databases/handlers/surveyDBHandler';
import { storeSurveyResult } from '../controllers/surveyController';
import { getServerConfig } from '../utils/getConfig';

describe('surveyResultController', () => {
  let response;
  let next;

  beforeEach(() => {
    process.env.VV_COSMOS_DB_ENDPOINT = 'https://testinghost/';
    response = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    } as any;
    next = jest.fn();
  });

  afterEach(() => {
    delete process.env.VV_COSMOS_DB_ENDPOINT;
    jest.resetAllMocks();
  });

  test('Should success on upsert', async () => {
    const inputData: any = {
      sessionId: 'test_session_id',
      callId: 'test_call_id',
      acsUserId: 'test_acs_user_id',
      response: true
    };
    const request: any = { body: inputData };
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
    const config = getServerConfig();

    jest.spyOn(Items.prototype, 'upsert').mockImplementationOnce((): Promise<any> => Promise.resolve());

    if (config.cosmosDb) {
      const surveyDBHandler = new SurveyDBHandler(mockedCosmosClient as any, config.cosmosDb);

      await storeSurveyResult(surveyDBHandler)(request, response, next);

      expect(response.send).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(200);
    }
  });

  test.each([
    ['sessionId is missing', { callId: 'test_call_id', acsUserId: 'test_acs_user_id', response: true }],
    ['callId is missing', { sessionId: 'test_session_id', acsUserId: 'test_acs_user_id', response: true }],
    ['acsUserId is missing', { sessionId: 'test_session_id', callId: 'test_call_id', response: true }],
    ['response is missing', { sessionId: 'test_session_id', callId: 'test_call_id', acsUserId: 'test_acs_user_id' }]
  ])('Test %s', async (expectedError: string, invalidInput: any) => {
    const expectedErrorResponse = {
      errors: [expectedError]
    };
    const request: any = { body: invalidInput };
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
    const config = getServerConfig();

    if (config.cosmosDb) {
      const surveyDBHandler = new SurveyDBHandler(mockedCosmosClient as any, config.cosmosDb);

      await storeSurveyResult(surveyDBHandler)(request, response, next);

      expect(response.send).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send).toHaveBeenCalledWith(expectedErrorResponse);
    }
  });

  test.each([
    [2, ['sessionId is missing', 'callId is missing'], { acsUserId: 'test_acs_user_id', response: true }],
    [2, ['sessionId is missing', 'acsUserId is missing'], { callId: 'test_call_id', response: true }],
    [2, ['sessionId is missing', 'response is missing'], { callId: 'test_call_id', acsUserId: 'test_acs_user_id' }],
    [2, ['callId is missing', 'acsUserId is missing'], { sessionId: 'test_session_id', response: true }],
    [2, ['callId is missing', 'response is missing'], { sessionId: 'test_session_id', acsUserId: 'test_acs_user_id' }],
    [2, ['acsUserId is missing', 'response is missing'], { sessionId: 'test_session_id', callId: 'test_call_id' }],
    [3, ['sessionId is missing', 'callId is missing', 'acsUserId is missing'], { response: true }],
    [3, ['sessionId is missing', 'callId is missing', 'response is missing'], { acsUserId: 'test_acs_user_id' }],
    [3, ['sessionId is missing', 'acsUserId is missing', 'response is missing'], { callId: 'test_call_id' }],
    [3, ['callId is missing', 'acsUserId is missing', 'response is missing'], { sessionId: 'test_session_id' }],
    [4, ['sessionId is missing', 'callId is missing', 'acsUserId is missing', 'response is missing'], {}]
  ])('Test when %d validations failed: %s', async (_, errors: string[], invalidInput: any) => {
    const expectedErrorResponse = { errors };
    const request: any = { body: invalidInput };
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
    const config = getServerConfig();

    if (config.cosmosDb) {
      const surveyDBHandler = new SurveyDBHandler(mockedCosmosClient as any, config.cosmosDb);

      await storeSurveyResult(surveyDBHandler)(request, response, next);

      expect(response.send).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send).toHaveBeenCalledWith(expectedErrorResponse);
    }
  });

  test('Should failed on any other errors.', async () => {
    const inputData: any = {
      sessionId: 'test_session_id',
      callId: 'test_call_id',
      acsUserId: 'test_acs_user_id',
      response: true
    };
    const expectedError = new Error('failed to save');
    const request: any = { body: inputData };
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

    jest.spyOn(SurveyDBHandler.prototype, 'saveSurveyResult').mockRejectedValueOnce(expectedError);

    const config = getServerConfig();

    if (config.cosmosDb) {
      const surveyDBHandler = new SurveyDBHandler(mockedCosmosClient as any, config.cosmosDb);

      await storeSurveyResult(surveyDBHandler)(request, response, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expectedError);
    }
  });
});
