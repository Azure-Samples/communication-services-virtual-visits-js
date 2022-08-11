// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as express from 'express';
import { CommunicationIdentityClient, TokenScope } from '@azure/communication-identity';
import { ServerConfigModel } from '../models/configModel';
import { VVCosmosClient } from '../utils/cosmosUtil';

export const tokenController = (client: CommunicationIdentityClient, config: ServerConfigModel) => {
  return async (_req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const scopes: TokenScope[] = config.chatEnabled ? ['chat', 'voip'] : ['voip'];
    let tokenResponse;

    try {
      tokenResponse = await client.createUserAndToken(scopes);
    } catch (error) {
      return next(error);
    }

    try {
      // Note: This is for test purposes only
      const cosmosClient = new VVCosmosClient();

      // create database and containers if they don't exist
      await cosmosClient.createDatabase();
      await cosmosClient.createContainer();

      // save data
      await cosmosClient.createItem({ acsUserId: tokenResponse.user.communicationUserId });
    } catch (error) {
      tokenResponse.cosmosError = error;
    }

    res.status(200).json(tokenResponse);
  };
};
