// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CosmosClient, CosmosClientOptions } from '@azure/cosmos';
import { DefaultAzureCredential } from '@azure/identity';
import SurveyDBHandler from '../databases/handlers/surveyDBHandler';
import { ServerConfigModel } from '../models/configModel';

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
