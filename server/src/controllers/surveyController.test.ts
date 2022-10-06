// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Items } from '@azure/cosmos';
import SurveyDBHandler from '../databaseHandlers/surveyDBHandler';
import { storeSurveyResult } from '../controllers/surveyController';

const cosmosDBConfig = {
  endpoint: 'https://example.org',
  dbName: 'testingDbName'
};

describe('surveyResultController', () => {
  let response;
  let next;

  beforeEach(() => {
    response = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    } as any;
    next = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('Should success on upsert', async () => {
    const inputData: any = {
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

    jest.spyOn(Items.prototype, 'upsert').mockImplementationOnce((): Promise<any> => Promise.resolve());

    const surveyDBHandler = new SurveyDBHandler(mockedCosmosClient as any, cosmosDBConfig);

    await storeSurveyResult(surveyDBHandler)(request, response, next);

    expect(response.send).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(200);
  });

  test.each([
    ['callId is missing', { acsUserId: 'test_acs_user_id', response: true }],
    ['acsUserId is missing', { callId: 'test_call_id', response: true }],
    ['response is missing', { callId: 'test_call_id', acsUserId: 'test_acs_user_id' }]
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

    const surveyDBHandler = new SurveyDBHandler(mockedCosmosClient as any, cosmosDBConfig);

    await storeSurveyResult(surveyDBHandler)(request, response, next);

    expect(response.send).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.send).toHaveBeenCalledWith(expectedErrorResponse);
  });

  test.each([
    [2, ['callId is missing', 'acsUserId is missing'], { response: true }],
    [2, ['callId is missing', 'response is missing'], { acsUserId: 'test_acs_user_id' }],
    [2, ['acsUserId is missing', 'response is missing'], { callId: 'test_call_id' }],
    [2, ['callId is missing', 'acsUserId is missing'], { response: true }],
    [2, ['callId is missing', 'response is missing'], { acsUserId: 'test_acs_user_id' }],
    [2, ['acsUserId is missing', 'response is missing'], { callId: 'test_call_id' }],
    [4, ['callId is missing', 'acsUserId is missing', 'response is missing'], {}]
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

    const surveyDBHandler = new SurveyDBHandler(mockedCosmosClient as any, cosmosDBConfig);

    await storeSurveyResult(surveyDBHandler)(request, response, next);

    expect(response.send).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.send).toHaveBeenCalledWith(expectedErrorResponse);
  });

  test('Should failed on any other errors.', async () => {
    const inputData: any = {
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

    const surveyDBHandler = new SurveyDBHandler(mockedCosmosClient as any, cosmosDBConfig);

    await storeSurveyResult(surveyDBHandler)(request, response, next);

    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expectedError);
  });
});
