// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../node_modules/@types/jest/index.d.ts" />

import request from 'supertest';
import app from './app';
import fs from 'fs';
import path from 'path';

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
      logoUrl: ''
    })
  };
});

const createFile = (filePath: string): void => {
  fs.writeFileSync(path.join(__dirname, filePath), '<!DOCTYPE html><html></html>');
};

const createDir = (): void => {
  fs.mkdirSync(path.join(__dirname, 'public'));
};

const deleteDir = (): void => {
  fs.rmdirSync(path.join(__dirname, 'public'));
};

const deleteFile = (filePath: string): void => {
  fs.unlinkSync(path.join(__dirname, filePath));
};

describe('route tests', () => {
  const bookFilePath = 'public/book.html';
  const visitFilePath = 'public/visit.html';
  const homeFilePath = 'public/home.html';

  /**
   * Create static files as they are not available during the local development
   * In prod these are compiled from client and copied into the public folder
   */
  beforeAll(() => {
    createDir();
    createFile(bookFilePath);
    createFile(visitFilePath);
    createFile(homeFilePath);
  });

  /**
   * Delete the previously created files and directory */
  afterAll(() => {
    deleteFile(bookFilePath);
    deleteFile(visitFilePath);
    deleteFile(homeFilePath);
    deleteDir();
  });

  test('/book should return 200 response with book html page', async () => {
    const getResponse = await request(app).get('/book');
    expect(getResponse.headers['content-type']).toEqual('text/html; charset=UTF-8');
    expect(getResponse.status).toEqual(200);
  });

  test('/visit should return 200 response with visit html page', async () => {
    const getResponse = await request(app).get('/visit');
    expect(getResponse.headers['content-type']).toEqual('text/html; charset=UTF-8');
    expect(getResponse.status).toEqual(200);
  });

  test('/home should return 200 response with home html page', async () => {
    const getResponse = await request(app).get('/');
    expect(getResponse.status).toEqual(200);
    expect(getResponse.headers['content-type']).toEqual('text/html; charset=UTF-8');
  });
});

describe('errors', () => {
  const filePath = 'public/pageNotFound.html';
  beforeAll(() => {
    createDir();
    createFile(filePath);
  });

  afterAll(() => {
    deleteFile(filePath);
    deleteDir();
  });

  test('returns 404 response with generic pageNotFound html', async () => {
    const getResponse = await request(app).get('/undefined_endpoint');
    expect(getResponse.headers['content-type']).toEqual('text/html; charset=UTF-8');
    expect(getResponse.status).toEqual(404);
  });

  test('returns a generic 500 response when an endpoints throws an error', async () => {
    // calling the /api/token endpoint without proper mocking throws TypeError
    const getResponse = await request(app).get('/api/token');
    expect(getResponse.status).toEqual(500);
    expect(JSON.parse(getResponse.text)).toHaveProperty('error');
  });

  test('check if /api/surveyResults route is close with no cosmosDb configs', async () => {
    const inputData: any = {
      callId: 'test_call_id',
      acsUserId: 'test_acs_user_id',
      meetingLink: 'test_meeting_link',
      response: true
    };

    const getResponse = await request(app).post('/api/surveyResults').send(inputData);

    expect(getResponse.status).toBe(404);
  });
});
