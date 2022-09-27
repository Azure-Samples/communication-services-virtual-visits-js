// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Containers, Databases, Items } from '@azure/cosmos';
import { getServerConfig } from '../../utils/getConfig';
import CosmosClient from '../cosmosClient';
import SurveyDBHandler from './surveyDBHandler';

describe('Test surveyDBHandler', () => {
  test('Test init', async () => {
    const config = getServerConfig();
    const cosmosClient = new CosmosClient(config);

    const spyOnDatabasesCreateIfNotExists = jest.spyOn(Databases.prototype, 'createIfNotExists');
    const spyOnContainersCreateIfNotExists = jest.spyOn(Containers.prototype, 'createIfNotExists');

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
    const cosmosClient = new CosmosClient(config);

    const spyOnUpsert = jest.spyOn(Items.prototype, 'upsert');

    const surveyDBHandler = new SurveyDBHandler(cosmosClient);
    await surveyDBHandler.saveSurveyResult(testInputData);

    expect(spyOnUpsert).toHaveBeenCalled();
  });
});
