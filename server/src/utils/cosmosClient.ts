// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CosmosClient, CosmosClientOptions, Database, Container, ContainerRequest } from '@azure/cosmos';
import { DefaultAzureCredential } from '@azure/identity';

const defaultAzureCredential = new DefaultAzureCredential();

const cosmosClientOptions: CosmosClientOptions = {
  endpoint: process.env.VV_COSMOS_DB_ENDPOINT!,
  aadCredentials: defaultAzureCredential
};

const initializeCosmosClient = () => {
  if (process.env.VV_COSMOS_DB_CONNECTION_STRING) {
    return new CosmosClient(process.env.VV_COSMOS_DB_CONNECTION_STRING);
  } else {
    return new CosmosClient(cosmosClientOptions);
  }
};

export const cosmosClient = initializeCosmosClient();

export const virtualVisitsDatabaseName = process.env.VV_COSMOS_DB_NAME!;
export const surveyContainerName = 'Surveys';
export const containerRequest: ContainerRequest = {
  id: surveyContainerName,
  partitionKey: {
    paths: ['/callId']
  }
};

export const createDatabase = async (): Promise<Database> => {
  const { database } = await cosmosClient.databases.createIfNotExists({
    id: virtualVisitsDatabaseName
  });

  return database;
};

export const createContainer = async (): Promise<Container> => {
  const { container } = await cosmosClient
    .database(virtualVisitsDatabaseName)
    .containers.createIfNotExists(containerRequest);

  return container;
};
