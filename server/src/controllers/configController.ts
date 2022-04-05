// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as express from 'express';
import { ServerConfigModel } from '../models/configModel';
import { getClientConfig } from '../utils/getConfig';

export const configController = (config: ServerConfigModel) => {
  return async (_req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    let clientConfig;

    try {
      clientConfig = getClientConfig(config);
    } catch (error) {
      return next(error);
    }

    res.status(200).json(clientConfig);
  };
};
