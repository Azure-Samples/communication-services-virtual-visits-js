// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import request from 'supertest';
import * as SurveyController from './controllers/surveyController';
import * as SurveyDBHandler from './databaseHandlers/surveyDBHandler';

jest.mock('./utils/getConfig', () => {
  return {
    getServerConfig: () => ({
      communicationServicesConnectionString: 'endpoint=your_endpoint;accesskey=secret',
      microsoftBookingsUrl: 'https://testBookingsUrl',
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
        endpoint: 'http://testinghost.com',
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
    const mockedSurveyDBHandler = {
      init: jest.fn()
    };
    const mockStoreSurveyResult = jest
      .spyOn(SurveyController, 'storeSurveyResult')
      .mockImplementationOnce(() => async () => Promise.resolve());

    jest.spyOn(SurveyDBHandler, 'createSurveyDBHandler').mockReturnValueOnce(mockedSurveyDBHandler as any);

    (await import('./app')).default;

    expect(mockStoreSurveyResult).toHaveBeenCalled();
  });

  test('return 200 sending option request', async () => {
    const app = (await import('./app')).default;
    const getResponse = await request(app).options('/api/surveyReesult');

    expect(getResponse.status).toBe(200);
  });

  test('check if /api/surveyResults route fail', async () => {
    jest
      .spyOn(SurveyController, 'storeSurveyResult')
      .mockImplementationOnce(() => async () => Promise.reject('failed'));

    const app = (await import('./app')).default;

    const getResponse = await request(app).post('/api/surveyReesult');

    expect(getResponse.status).toBe(500);
  });
});
