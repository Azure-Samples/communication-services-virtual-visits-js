// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Items } from '@azure/cosmos';
import SurveyDBHandler from '../databaseHandlers/surveyDBHandler';
import { storeSurveyResult } from '../controllers/surveyController';

const cosmosDBConfig = {
  connectionString: 'https://example.org',
  dbName: 'testingDbName'
};

describe('surveyResultController', () => {
  let response;
  let next;

  beforeEach(() => {
    jest.resetAllMocks();
    response = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    } as any;
    next = jest.fn();
  });

  test('Should success on upsert', async () => {
    const inputData: any = {
      callId: 'test_call_id',
      acsUserId: 'test_acs_user_id',
      meetingLink: 'test_meeting_link',
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
                upsert: mockedUpsert,
                query: jest.fn().mockImplementation(() => {
                  return {
                    fetchAll: () => ({ resources: [] })
                  };
                })
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
    ['callId must be present', { acsUserId: 'test_acs_user_id', meetingLink: 'test_meeting_link', response: true }],
    ['acsUserId must be present', { callId: 'test_call_id', meetingLink: 'test_meeting_link', response: true }],
    ['meetingLink must be present', { callId: 'test_call_id', acsUserId: 'test_acs_user_id', response: true }],
    [
      'response must be present',
      { callId: 'test_call_id', acsUserId: 'test_acs_user_id', meetingLink: 'test_meeting_link' }
    ]
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
                upsert: mockedUpsert,
                query: jest.fn().mockImplementation(() => {
                  return {
                    fetchAll: () => ({ resources: [] })
                  };
                })
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
    [2, ['callId must be present', 'acsUserId must be present'], { meetingLink: 'test_meeting_link', response: true }],
    [2, ['callId must be present', 'meetingLink must be present'], { acsUserId: 'test_acs_user_id', response: true }],
    [
      2,
      ['callId must be present', 'response must be present'],
      { acsUserId: 'test_acs_user_id', meetingLink: 'test_meeting_link' }
    ],
    [2, ['acsUserId must be present', 'meetingLink must be present'], { callId: 'test_call_id', response: true }],
    [
      2,
      ['acsUserId must be present', 'response must be present'],
      { callId: 'test_call_id', meetingLink: 'test_meeting_link' }
    ],
    [
      2,
      ['meetingLink must be present', 'response must be present'],
      { callId: 'test_call_id', acsUserId: 'test_acs_user_id' }
    ],
    [3, ['callId must be present', 'acsUserId must be present', 'meetingLink must be present'], { response: true }],
    [
      3,
      ['acsUserId must be present', 'meetingLink must be present', 'response must be present'],
      { callId: 'test_call_id' }
    ],
    [
      3,
      ['callId must be present', 'acsUserId must be present', 'response must be present'],
      { meetingLink: 'test_meeting_link' }
    ],
    [
      3,
      ['callId must be present', 'meetingLink must be present', 'response must be present'],
      { acsUserId: 'test_acs_user_id' }
    ],
    [
      4,
      [
        'callId must be present',
        'acsUserId must be present',
        'meetingLink must be present',
        'response must be present'
      ],
      {}
    ]
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
                upsert: mockedUpsert,
                query: jest.fn().mockImplementation(() => {
                  return {
                    fetchAll: () => ({ resources: [] })
                  };
                })
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
      meetingLink: 'test_meeting_link',
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
                upsert: mockedUpsert,
                query: jest.fn().mockImplementation(() => {
                  return {
                    fetchAll: () => ({ resources: [] })
                  };
                })
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
