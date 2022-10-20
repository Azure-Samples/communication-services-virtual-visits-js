// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { VV_COSMOS_DB_CONNECTION_STRING, VV_COSMOS_DB_NAME } from '../constants';
import { CosmosDBConfig, ServerConfigModel } from '../models/configModel';

const getCosmosDBConfig = (defaultConfig: ServerConfigModel): CosmosDBConfig | undefined => {
  const cosmosDBConnectionString =
    process.env[VV_COSMOS_DB_CONNECTION_STRING] ?? (defaultConfig.cosmosDb?.connectionString as string);

  const cosmosDBConfig: CosmosDBConfig = {
    dbName: process.env[VV_COSMOS_DB_NAME] ?? (defaultConfig.cosmosDb?.dbName as string),
    connectionString: cosmosDBConnectionString
  };

  if (!cosmosDBConnectionString) {
    return undefined;
  }
  return cosmosDBConfig;
};

export default getCosmosDBConfig;
