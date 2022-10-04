// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CosmosClient } from '@azure/cosmos';
import { ContainerRequest } from '@azure/cosmos';
import { CosmosDBConfig } from '../../models/configModel';
import { SurveyResultRequestModel } from '../../models/surveyModel';

const surveyContainerName = 'Surveys';

class SurveyDBHandler {
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

export default SurveyDBHandler;
