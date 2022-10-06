// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CosmosClient, CosmosClientOptions, ContainerRequest } from '@azure/cosmos';
import { DefaultAzureCredential } from '@azure/identity';
import { CosmosDBConfig } from '../models/configModel';
import { SurveyResultRequestModel } from '../models/surveyModel';
import { ServerConfigModel } from '../models/configModel';

const surveyContainerName = 'Surveys';

const createCosmosClient = (config): CosmosClient => {
  if (config.cosmosDb.connectionString && config.cosmosDb.connectionString.length > 0) {
    return new CosmosClient(config.cosmosDb.connectionString);
  } else {
    const cosmosClientOptions: CosmosClientOptions = {
      endpoint: config.cosmosDb.endpoint as string,
      aadCredentials: new DefaultAzureCredential()
    };

    return new CosmosClient(cosmosClientOptions);
  }
};

export const createSurveyDBHandler = (config: ServerConfigModel): SurveyDBHandler | undefined => {
  if (config.postCall?.survey.type && config.postCall.survey.type === 'onequestionpoll') {
    if (config.cosmosDb) {
      const cosmosClient = createCosmosClient(config);

      return new SurveyDBHandler(cosmosClient, config.cosmosDb);
    }
  }

  return undefined;
};

export default class SurveyDBHandler {
  public connection;
  private cosmosClient: CosmosClient;
  private cosmosDBConfig: CosmosDBConfig;

  constructor(cosmosClient: CosmosClient, config: CosmosDBConfig) {
    this.cosmosClient = cosmosClient;
    this.cosmosDBConfig = config;
  }

  async init(): Promise<void> {
    await this.cosmosClient.databases.createIfNotExists({
      id: this.cosmosDBConfig.dbName
    });

    const containerRequest: ContainerRequest = {
      id: surveyContainerName,
      partitionKey: {
        paths: ['/callId']
      }
    };

    await this.cosmosClient.database(this.cosmosDBConfig.dbName).containers.createIfNotExists(containerRequest);
  }

  async saveSurveyResult(inputData: SurveyResultRequestModel): Promise<void> {
    await this.cosmosClient.database(this.cosmosDBConfig.dbName).container(surveyContainerName).items.upsert(inputData);
  }
}
