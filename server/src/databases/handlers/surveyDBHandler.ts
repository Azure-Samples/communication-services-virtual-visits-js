// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ContainerRequest } from '@azure/cosmos';
import CosmosClient from '../../databases/cosmosClient';
import { SurveyResultRequestModel } from '../../models/surveyModel';

const surveyContainerName = 'Surveys';
const containerRequest: ContainerRequest = {
  id: surveyContainerName,
  partitionKey: {
    paths: ['/callId']
  }
};

class SurveyDBHandler {
  private cosmosClient: CosmosClient;

  constructor(cosmosClient: CosmosClient) {
    this.cosmosClient = cosmosClient;
  }

  async init(): Promise<void> {
    await this.cosmosClient.createDatabase();
    await this.cosmosClient.createContainer(containerRequest);
  }

  async saveSurveyResult(inputData: SurveyResultRequestModel): Promise<void> {
    this.cosmosClient.upsert(surveyContainerName, inputData);
  }
}

export default SurveyDBHandler;
