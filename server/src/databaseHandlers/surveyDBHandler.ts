// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CosmosClient, ContainerRequest } from '@azure/cosmos';
import { CosmosDBConfig } from '../models/configModel';
import { SurveyResultRequestModel } from '../models/surveyModel';
import { ServerConfigModel } from '../models/configModel';

const surveyContainerName = 'Surveys';

export const createSurveyDBHandler = (config: ServerConfigModel): SurveyDBHandler | undefined => {
  try {
    if (
      config.postCall === undefined ||
      config.postCall.survey.type !== 'onequestionpoll' ||
      config.cosmosDb === undefined
    ) {
      return undefined;
    }

    const cosmosClient = new CosmosClient(config.cosmosDb.connectionString);
    return new SurveyDBHandler(cosmosClient, config.cosmosDb);
  } catch (e) {
    return undefined;
  }
};

export default class SurveyDBHandler {
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
      },
      uniqueKeyPolicy: {
        uniqueKeys: [{ paths: ['/callId'] }]
      }
    };

    await this.cosmosClient.database(this.cosmosDBConfig.dbName).containers.createIfNotExists(containerRequest);
  }

  async saveSurveyResult(inputData: SurveyResultRequestModel): Promise<void> {
    await this.cosmosClient.database(this.cosmosDBConfig.dbName).container(surveyContainerName).items.upsert(inputData);
  }
}
