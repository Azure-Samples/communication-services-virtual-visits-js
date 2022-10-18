// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { VV_COSMOS_DB_CONNECTION_STRING, VV_COSMOS_DB_NAME } from '../constants';
import { CosmosDBConfig, ServerConfigModel } from '../models/configModel';

const getCosmosDBConfig = (defaultConfig: ServerConfigModel): CosmosDBConfig | undefined => {
  const cosmosDBConfig: CosmosDBConfig = {
    dbName: process.env[VV_COSMOS_DB_NAME] ?? (defaultConfig.cosmosDb?.dbName as string)
  };

  const cosmosDBConnectionString =
    process.env[VV_COSMOS_DB_CONNECTION_STRING] ?? defaultConfig.cosmosDb?.connectionString;

  if (!cosmosDBConnectionString) {
    return undefined;
  }
  cosmosDBConfig.connectionString = cosmosDBConnectionString;
  return cosmosDBConfig;
};

export default getCosmosDBConfig;
