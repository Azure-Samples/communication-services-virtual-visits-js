// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../node_modules/@types/jest/index.d.ts" />

import request from 'supertest';
import app from './app';
import { ERROR_PAYLOAD_404, ERROR_PAYLOAD_500 } from './errors';

describe('app route tests', () => {
  test('/ should redirect to /book', async () => {
    const getResponse = await request(app).get('/');
    expect(getResponse.status).toEqual(302);
    expect(getResponse.headers.location).toEqual('book');
  });
});

describe('errors', () => {
  test('returns a generic 404 response when accessing invalid endpoints', async () => {
    const getResponse = await request(app).get('/undefined_endpoint');
    expect(getResponse.status).toEqual(404);
    expect(getResponse.text).toEqual(JSON.stringify(ERROR_PAYLOAD_404));
  });

  test('returns a generic 500 response when an endpoints throws an error', async () => {
    // calling the /api/token endpoint without proper mocking throws TypeError
    const getResponse = await request(app).get('/api/token');
    expect(getResponse.status).toEqual(500);
    expect(getResponse.text).toEqual(JSON.stringify(ERROR_PAYLOAD_500));
  });
});
