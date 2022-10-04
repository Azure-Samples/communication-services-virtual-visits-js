// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import request from 'supertest';
import * as surveyDBHandlerUtil from './utils/surveyDBHandlerUtil';

describe('Tes survey route', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('check if /api/surveyResults route is open with cosmosDb configs', async () => {
    const inputData: any = {
      sessionId: 'test_session_id',
      callId: 'test_call_id',
      acsUserId: 'test_acs_user_id',
      response: true
    };

    jest.spyOn(surveyDBHandlerUtil, 'createSurveyDBHandler').mockReturnValueOnce(undefined);

    const app = (await import('./app')).default;

    const getResponse = await request(app).post('/api/surveyResults').send(inputData);

    expect(getResponse.status).toBe(500);
  });
});
