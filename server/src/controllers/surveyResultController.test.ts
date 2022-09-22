// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Containers, ContainerResponse, Databases, DatabaseResponse, Items, ItemResponse } from '@azure/cosmos';
import request from 'supertest';
import app from '../app';

jest
  .spyOn(Databases.prototype, 'createIfNotExists')
  .mockResolvedValueOnce({ database: { id: '1' } } as DatabaseResponse);

jest
  .spyOn(Containers.prototype, 'createIfNotExists')
  .mockResolvedValueOnce({ container: { id: '1' } } as ContainerResponse);

jest
  .spyOn(Items.prototype, 'upsert')
  .mockResolvedValueOnce({ item: { id: '1', container: { id: '1', database: { id: '1' } } } } as ItemResponse<any>);

describe('surveyResultController', () => {
  test('Should success on upsert.', async () => {
    const inputData: any = {
      sessionId: 'test_session_id',
      callId: 'test_call_id',
      acsUserId: 'test_acs_user_id',
      response: true
    };

    const res = await request(app).post('/api/createSurveyResult').send(inputData);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual('Store successfully.');
  });

  test('Should failed on the validation.', async () => {
    const invalidInputData: any = {
      callId: 'test_call_id',
      acsUserId: 'test_acs_user_id',
      response: true
    };
    const expectedError = {
      error: 'Payload invalid.'
    };

    const res = await request(app).post('/api/createSurveyResult').send(invalidInputData);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expectedError);
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

    jest.spyOn(Databases.prototype, 'createIfNotExists').mockRejectedValueOnce(new Error('failed to create database'));

    const res = await request(app).post('/api/createSurveyResult').send(inputData);

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual(expectedError);
  });
});
