// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const mockedSaveSurveyResult = jest.fn();

import app from './app';
import request from 'supertest';

jest.mock('./databaseHandlers/surveyDBHandler', () => {
  return {
    createSurveyDBHandler: jest.fn().mockImplementation(() => ({
      init: jest.fn(),
      saveSurveyResult: mockedSaveSurveyResult
    })),
    SurveyDBHandler: jest.fn()
  };
});

jest.mock('./utils/getConfig', () => {
  return {
    getServerConfig: () => ({
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
    })
  };
});

describe('Tes survey route', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('check if /api/surveyResults route is open with cosmosDb configs', async () => {
    const inputData: any = {
      callId: 'test_call_id',
      acsUserId: 'test_acs_user_id',
      response: true
    };
    const getResponse = await request(app).post('/api/surveyResults').send(inputData);

    expect(mockedSaveSurveyResult).toHaveBeenCalled();
    expect(getResponse.status).toBe(200);
  });

  test('check if submit survey that already exists.', async () => {
    const expectedErrorCode = 409;
    const expectedErrorMessage = 'Unique index constraint violation.';
    (mockedSaveSurveyResult as jest.Mock).mockRejectedValueOnce({
      code: expectedErrorCode,
      message: expectedErrorMessage
    });
    const inputData: any = {
      callId: 'test_call_id',
      acsUserId: 'test_acs_user_id',
      response: true
    };
    const getResponse = await request(app).post('/api/surveyResults').send(inputData);

    expect(getResponse.status).toBe(expectedErrorCode);
    expect(getResponse.body.error).toBe(expectedErrorMessage);
  });
});
