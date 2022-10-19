// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CosmosClient, ContainerRequest, Resource } from '@azure/cosmos';
import { CosmosDBConfig } from '../models/configModel';
import { SurveyResultRequestModel } from '../models/surveyModel';
import { ServerConfigModel } from '../models/configModel';

const surveyContainerName = 'Surveys';

export const createSurveyDBHandler = (config: ServerConfigModel): SurveyDBHandler | undefined => {
  console.log('in createSurveyDBHandler');
  if (config.postCall?.survey.type && config.postCall.survey.type === 'onequestionpoll') {
    if (config.cosmosDb) {
      const cosmosClient = new CosmosClient(config.cosmosDb.connectionString);

      return new SurveyDBHandler(cosmosClient, config.cosmosDb);
    }
  }

  return undefined;
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
      }
    };

    await this.cosmosClient.database(this.cosmosDBConfig.dbName).containers.createIfNotExists(containerRequest);
  }

  async saveSurveyResult(inputData: SurveyResultRequestModel): Promise<void> {
    await this.cosmosClient.database(this.cosmosDBConfig.dbName).container(surveyContainerName).items.upsert(inputData);
  }

  async querySurvey(callId: string, acsUserId: string): Promise<Resource[]> {
    const querySpec = {
      query: `SELECT * FROM ${this.cosmosDBConfig.dbName} db WHERE db.callId = @callId AND db.acsUserId = @acsUserId`,
      parameters: [
        {
          name: '@callId',
          value: callId
        },
        {
          name: '@acsUserId',
          value: acsUserId
        }
      ]
    };

    const { resources: results } = await this.cosmosClient
      .database(this.cosmosDBConfig.dbName)
      .container(surveyContainerName)
      .items.query(querySpec)
      .fetchAll();

    return results;
  }
}
