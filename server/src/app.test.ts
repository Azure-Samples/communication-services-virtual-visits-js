// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../node_modules/@types/jest/index.d.ts" />

import request from 'supertest';
import app from './app';
import { ERROR_PAYLOAD_500 } from './errors';
import fs from 'fs';
import path from 'path';

function createFile(filePath) {
  fs.writeFile(filePath, '<!DOCTYPE html><html></html>', function (err) {
    if (err) throw err;
  });
}

function createDir() {
  fs.mkdir(path.join(__dirname, 'public'), (err) => {
    if (err) throw err;
  });
}

function deleteDir() {
  fs.rmdir(path.join(__dirname, 'public'), (err) => {
    if (err) throw err;
  });
}

describe('app route tests', () => {
  test('/ should redirect to /book', async () => {
    const getResponse = await request(app).get('/');
    expect(getResponse.status).toEqual(302);
    expect(getResponse.headers.location).toEqual('book');
  });
});

describe('route tests', () => {
  const bookFilePath = path.join(__dirname, 'public/book.html');
  const visitFilePath = path.join(__dirname, 'public/visit.html');
  beforeAll(() => {
    createDir();
    createFile(bookFilePath);
    createFile(visitFilePath);
  });
  afterAll(() => {
    fs.unlinkSync(bookFilePath);
    fs.unlinkSync(visitFilePath);
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
});

describe('errors', () => {
  const filePath = path.join(__dirname, 'public/pageNotFound.html');
  beforeAll(() => {
    createDir();
    createFile(filePath);
  });

  afterAll(() => {
    fs.unlinkSync(filePath);
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
    expect(getResponse.text).toEqual(JSON.stringify(ERROR_PAYLOAD_500));
  });
});
