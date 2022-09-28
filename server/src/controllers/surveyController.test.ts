// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import request from 'supertest';
import app from '../app';
import SurveyDBHandler from '../databases/handlers/surveyDBHandler';

jest.mock('../databases/cosmosClient');

describe('surveyResultController', () => {
  test('Should success on upsert.', async () => {
    const inputData: any = {
      sessionId: 'test_session_id',
      callId: 'test_call_id',
      acsUserId: 'test_acs_user_id',
      response: true
    };

    const res = await request(app).post('/api/createSurveyResult').send(inputData);

    expect(res.statusCode).toEqual(201);
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

    const res = await request(app).post('/api/createSurveyResult').send(invalidInput);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expectedErrorResponse);
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
    const expectedErrorResponse = {
      errors: errors
    };

    const res = await request(app).post('/api/createSurveyResult').send(invalidInput);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expectedErrorResponse);
  });

  test('Should failed on any other errors.', async () => {
    const inputData: any = {
      sessionId: 'test_session_id',
      callId: 'test_call_id',
      acsUserId: 'test_acs_user_id',
      response: true
    };
    const expectedError = {
      errors: [
        {
          detail: 'The server has encountered an error. Refresh the page to try again.',
          status: 500,
          title: '500: Internal server error'
        }
      ]
    };

    jest.spyOn(SurveyDBHandler.prototype, 'saveSurveyResult').mockRejectedValueOnce(new Error('failed to save'));

    const res = await request(app).post('/api/createSurveyResult').send(inputData);

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual(expectedError);
  });
});
