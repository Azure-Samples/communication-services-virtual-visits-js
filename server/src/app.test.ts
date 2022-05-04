// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../node_modules/@types/jest/index.d.ts" />

import request from 'supertest';
import app from './app';
import { ERROR_PAYLOAD_500 } from './errors';
import fs from 'fs';
import path from 'path';

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

describe('app route tests', () => {
  test('/ should redirect to /book', async () => {
    const getResponse = await request(app).get('/');
    expect(getResponse.status).toEqual(302);
    expect(getResponse.headers.location).toEqual('book');
  });
});

describe('route tests', () => {
  const bookFilePath = 'public/book.html';
  const visitFilePath = 'public/visit.html';
  /**
   * Create static files as they are not available during the local development
   * In prod these are compiled from client and copied into the public folder
   */
  beforeAll(() => {
    createDir();
    createFile(bookFilePath);
    createFile(visitFilePath);
  });
  /**
   * Delete the previously created files and directory */
  afterAll(() => {
    deleteFile(bookFilePath);
    deleteFile(visitFilePath);
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
    expect(getResponse.text).toEqual(JSON.stringify(ERROR_PAYLOAD_500));
  });
});
