// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import SurveyDBHandler from '../databaseHandlers/surveyDBHandler';
import { surveyResultRequestValidator } from './validators';

const cosmosDBConfig = {
  endpoint: 'https://example.org',
  dbName: 'testingDbName'
};

describe('validators test', () => {
  describe('testing surveyResultRequestValidator', () => {
    describe('testing when fields are not present', () => {
      test.each([
        [1, ['callId must be present'], { acsUserId: 'test_acs_user_id', response: true }],
        [1, ['acsUserId must be present'], { callId: 'test_call_id', response: true }],
        [1, ['response must be present'], { callId: 'test_call_id', acsUserId: 'test_acs_user_id' }],
        [2, ['callId must be present', 'acsUserId must be present'], { response: true }],
        [2, ['callId must be present', 'response must be present'], { acsUserId: 'test_acs_user_id' }],
        [2, ['acsUserId must be present', 'response must be present'], { callId: 'test_call_id' }],
        [2, ['callId must be present', 'acsUserId must be present'], { response: true }],
        [2, ['callId must be present', 'response must be present'], { acsUserId: 'test_acs_user_id' }],
        [2, ['acsUserId must be present', 'response must be present'], { callId: 'test_call_id' }],
        [3, ['callId must be present', 'acsUserId must be present', 'response must be present'], {}]
      ])('Test when %d input fields missing: %s', async (_, expectedErrors: string[], invalidInput: any) => {
        const mockedCosmosClient = {
          database: jest.fn().mockImplementation(() => {
            return {
              container: jest.fn().mockImplementation(() => {
                return {
                  items: {
                    upsert: jest.fn(),
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
        const errors = await surveyResultRequestValidator(invalidInput, surveyDBHandler);

        expect(errors).toEqual(expectedErrors);
      });
    });

    describe('testing when field type is not correct', () => {
      test.each([
        ['callId', ['callId type must be string'], { callId: 1, acsUserId: 'test_acs_user_id', response: true }],
        ['acsUserId', ['acsUserId type must be string'], { callId: 'testing_call_id', acsUserId: 1, response: true }],
        [
          'response',
          ['response type must be one of boolean, string, number'],
          { callId: 'tesing_call_id', acsUserId: 'testing_acs_user_id', response: {} }
        ]
      ])('Test when %s input field type is wrong.', async (_, expectedErrors: string[], invalidInput: any) => {
        const mockedCosmosClient = {
          database: jest.fn().mockImplementation(() => {
            return {
              container: jest.fn().mockImplementation(() => {
                return {
                  items: {
                    upsert: jest.fn(),
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
        const errors = await surveyResultRequestValidator(invalidInput, surveyDBHandler);

        expect(errors).toEqual(expectedErrors);
      });
    });

    test('testing when the survey already submitted', async () => {
      const invalidInput = {
        callId: 'test_call_id',
        acsUserId: 'test_acs_user_id',
        response: true
      };
      const mockedCosmosClient = {
        database: jest.fn().mockImplementation(() => {
          return {
            container: jest.fn().mockImplementation(() => {
              return {
                items: {
                  upsert: jest.fn(),
                  query: jest.fn().mockImplementation(() => {
                    return {
                      fetchAll: () => ({ resources: [{ ...invalidInput }] })
                    };
                  })
                }
              };
            })
          };
        })
      };

      const surveyDBHandler = new SurveyDBHandler(mockedCosmosClient as any, cosmosDBConfig);
      const errors = await surveyResultRequestValidator(invalidInput, surveyDBHandler);

      expect(errors).toEqual([
        `Response has already been recorded for call id ${invalidInput.callId} and user id ${invalidInput.acsUserId}`
      ]);
    });
  });
});
