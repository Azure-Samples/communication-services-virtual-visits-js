// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { VV_COSMOS_DB_CONNECTION_STRING, VV_COSMOS_DB_ENDPOINT, VV_COSMOS_DB_NAME } from '../constants';
import { CosmosDBConfig, ServerConfigModel } from '../models/configModel';

const getCosmosDBConfig = (defaultConfig: ServerConfigModel): CosmosDBConfig | undefined => {
  const cosmosDBConfig: CosmosDBConfig = {
    dbName: process.env[VV_COSMOS_DB_NAME] ?? (defaultConfig.cosmosDb?.dbName as string)
  };

  const cosmosDBConnectionString =
    process.env[VV_COSMOS_DB_CONNECTION_STRING] ?? defaultConfig.cosmosDb?.connectionString;
  const cosmosDBEndpoint = process.env[VV_COSMOS_DB_ENDPOINT] ?? defaultConfig.cosmosDb?.endpoint;

  if (!(cosmosDBConnectionString || cosmosDBEndpoint)) {
    return undefined;
  }

  if (cosmosDBConnectionString) {
    cosmosDBConfig.connectionString = cosmosDBConnectionString;
  }

  if (cosmosDBEndpoint) {
    cosmosDBConfig.endpoint = cosmosDBEndpoint;
  }

  return cosmosDBConfig;
};

export default getCosmosDBConfig;
