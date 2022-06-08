// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import express from "express";
import { Server } from "http";
import path from "path";

/* This file is not required if following approach 1 */

let server: Server;
const app = express();

export const createTestServer = (props: { serverUrl: string }) =>
  // eslint-disable-next-line no-empty-pattern, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  async ({}, use: (r: string) => Promise<void>) => {
    await startServer();
    try {
      await use(props.serverUrl);
    } finally {
      await stopServer();
    }
  };

const startServer = (): Promise<void> => {
  app.use(express.static(path.resolve("dist")));
  return new Promise((resolve) => {
    server = app.listen(8080, () => {
      resolve();
    });
  });
};

const stopServer = (): Promise<void> =>
  new Promise((resolve, reject) => {
    if (!server) {
      reject(false);
    }
    server.close(() => {
      resolve();
    });
  });
