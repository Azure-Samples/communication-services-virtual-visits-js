// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Containers, ContainerResponse, Databases, DatabaseResponse, Items } from '@azure/cosmos';
import { getServerConfig } from '../../utils/getConfig';
import CosmosClient from '../cosmosClient';
import SurveyDBHandler from './surveyDBHandler';

describe('Test surveyDBHandler', () => {
  beforeEach(() => {
    process.env.VV_COSMOS_DB_ENDPOINT = 'https://testinghost/';
  });

  afterEach(() => {
    delete process.env.VV_COSMOS_DB_ENDPOINT;
  });

  test('Test init', async () => {
    const config = getServerConfig();
    let cosmosClient;

    if (config.cosmosDb) {
      cosmosClient = new CosmosClient(config.cosmosDb);
    } else {
      expect(cosmosClient).toBeUndefined();
    }

    const spyOnDatabasesCreateIfNotExists = jest
      .spyOn(Databases.prototype, 'createIfNotExists')
      .mockResolvedValueOnce({} as DatabaseResponse);
    const spyOnContainersCreateIfNotExists = jest
      .spyOn(Containers.prototype, 'createIfNotExists')
      .mockResolvedValueOnce({} as ContainerResponse);

    const surveyDBHandler = new SurveyDBHandler(cosmosClient);
    await surveyDBHandler.init();

    expect(spyOnDatabasesCreateIfNotExists).toHaveBeenCalled();
    expect(spyOnContainersCreateIfNotExists).toHaveBeenCalled();
  });

  test('Test saveSurveyResult', async () => {
    const testInputData: any = {
      sessionId: 'test_session_id',
      callId: 'test_call_id',
      acsUserId: 'test_acs_user_id',
      response: true
    };
    const config = getServerConfig();
    let cosmosClient;

    if (config.cosmosDb) {
      cosmosClient = new CosmosClient(config.cosmosDb);
    } else {
      expect(cosmosClient).toBeUndefined();
    }

    const spyOnUpsert = jest
      .spyOn(Items.prototype, 'upsert')
      .mockImplementationOnce((): Promise<any> => Promise.resolve());

    const surveyDBHandler = new SurveyDBHandler(cosmosClient);
    await surveyDBHandler.saveSurveyResult(testInputData);

    expect(spyOnUpsert).toHaveBeenCalled();
  });
});
