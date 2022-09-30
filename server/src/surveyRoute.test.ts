// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import request from 'supertest';
import app from './app';

jest.mock('@azure/cosmos');

jest.mock('./databases/handlers/surveyDBHandler');

jest.mock('./utils/getConfig', () => {
  return {
    getServerConfig: () => ({
      communicationServicesConnectionString:
        'endpoint=https://acs-han-20220913.communication.azure.com/;accesskey=rtRvrjHfuu79ihflL0/k6UqdhbTAMWQwZIRCTCnhp7fqlbaWfdzWItmIfzD60YZPuu9bLRB3y7ehUYaJSx36Iw==',
      microsoftBookingsUrl:
        'https://microsoftbookings.azurewebsites.net/?organization=financialservices&UICulture=en-US&CallBackURL=https%3A%2F%2Fproducts.office.com/business/bookings',
      chatEnabled: true,
      screenShareEnabled: true,
      companyName: 'Lamna Healthcare',
      colorPalette: '#0078d4',
      waitingTitle: 'Thank you for choosing Lamna Healthcare',
      waitingSubtitle: 'Your clinician is joining the meeting',
      logoUrl: '',
      postCall: undefined,
      cosmosDb: {
        endpoint: 'testingEndpoint',
        dbName: 'testingDBName'
      }
    })
  };
});

describe('Tes survey route', () => {
  test('check if /api/surveyResults route is open with cosmosDb configs', async () => {
    const inputData: any = {
      sessionId: 'test_session_id',
      callId: 'test_call_id',
      acsUserId: 'test_acs_user_id',
      response: true
    };
    const getResponse = await request(app).post('/api/surveyResults').send(inputData);
    expect(getResponse.status).toBe(200);
  });
});
