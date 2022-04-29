// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../node_modules/@types/jest/index.d.ts" />

import request from 'supertest';
import app from './app';
import { ERROR_PAYLOAD_500 } from './errors';
import fs from 'fs';
import path from 'path';

describe('app route tests', () => {
  beforeAll(() => {
    fs.mkdir(path.join(__dirname, 'public'), (err) => {
      if (err) throw err;
    });
    const bookFilePath = path.join(__dirname, 'public/book.html');
    const visitFilePath = path.join(__dirname, 'public/visit.html');
    fs.writeFile(bookFilePath, '<!DOCTYPE html><html></html>', function (err) {
      if (err) throw err;
    });
    fs.writeFile(visitFilePath, '<!DOCTYPE html><html></html>', function (err) {
      if (err) throw err;
    });
  });
  afterAll(() => {
    const bookFilePath = path.join(__dirname, 'public/book.html');
    const visitFilePath = path.join(__dirname, 'public/visit.html');
    fs.unlinkSync(bookFilePath);
    fs.unlinkSync(visitFilePath);
    fs.rmdir(path.join(__dirname, 'public'), (err) => {
      if (err) throw err;
    });
  });

  test('/ should redirect to /book', async () => {
    const getResponse = await request(app).get('/');
    expect(getResponse.status).toEqual(302);
    expect(getResponse.headers.location).toEqual('book');
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
});

describe('errors', () => {
  beforeAll(() => {
    fs.mkdir(path.join(__dirname, 'public'), (err) => {
      if (err) throw err;
    });
    const filePath = path.join(__dirname, 'public/pageNotFound.html');
    fs.writeFile(filePath, '<!DOCTYPE html><html></html>', function (err) {
      if (err) throw err;
    });
  });

  afterAll(() => {
    const filePath = path.join(__dirname, 'public/pageNotFound.html');
    fs.unlinkSync(filePath);
    fs.rmdir(path.join(__dirname, 'public'), (err) => {
      if (err) throw err;
    });
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
    expect(getResponse.text).toEqual(JSON.stringify(ERROR_PAYLOAD_500));
  });
});
