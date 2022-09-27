// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Containers, ContainerResponse, ContainerRequest, Databases, DatabaseResponse, Items } from '@azure/cosmos';
import CosmosClient from './cosmosClient';
import { getServerConfig } from '../utils/getConfig';

describe('Test cosmosClient', () => {
  afterEach(() => {
    delete process.env.VV_COSMOS_DB_CONNECTION_STRING;
  });

  test('Initialize cosmosClient when VV_COSMOS_DB_CONNECTION_STRING present.', async () => {
    const expectedEndpoint = 'https://testinghost/';
    const expectedAccountKey = 'testAccountKey';
    process.env.VV_COSMOS_DB_CONNECTION_STRING = `AccountEndpoint=${expectedEndpoint};AccountKey=${expectedAccountKey}`;

    const config = getServerConfig();
    const cosmosClient = new CosmosClient(config);

    const endpoint = cosmosClient['clientContext']['cosmosClientOptions']['endpoint'];
    const accountKey = cosmosClient['clientContext']['cosmosClientOptions']['key'];

    expect(endpoint).toBe(expectedEndpoint);
    expect(accountKey).toBe(expectedAccountKey);
  });

  test('Initialize cosmosClient when VV_COSMOS_DB_CONNECTION_STRING not present.', async () => {
    const config = getServerConfig();
    const cosmosClient = new CosmosClient(config);

    expect(cosmosClient['clientContext']['cosmosClientOptions']).not.toHaveProperty('key');
  });

  test('Test if database is undefined without calling createDatabase', () => {
    const config = getServerConfig();
    const cosmosClient = new CosmosClient(config);

    expect(cosmosClient.getDatabase()).toBeUndefined();
  });

  test('Test creating database', async () => {
    const expectedDatabaseId = 'testDatabaseId';

    const config = getServerConfig();
    const cosmosClient = new CosmosClient(config);

    jest
      .spyOn(Databases.prototype, 'createIfNotExists')
      .mockResolvedValueOnce({ database: { id: expectedDatabaseId } } as DatabaseResponse);

    await cosmosClient.createDatabase();

    const createdDatabase = cosmosClient.getDatabase();

    expect(createdDatabase!.id).toBe(expectedDatabaseId);
  });

  test("Test createIfNotExists doesn't get trigger when database already exists", async () => {
    const expectedDatabaseId = 'testDatabaseId';

    const config = getServerConfig();
    const cosmosClient = new CosmosClient(config);

    const mockedCreateIfNotExists = jest
      .spyOn(Databases.prototype, 'createIfNotExists')
      .mockResolvedValueOnce({ database: { id: expectedDatabaseId } } as DatabaseResponse);

    // Call createDatabase to run at the beginning.
    await cosmosClient.createDatabase();

    expect(cosmosClient.getDatabase()).not.toBeUndefined();

    await cosmosClient.createDatabase();

    // Expected to be called only once even we called createDatabase twice.
    expect(mockedCreateIfNotExists).toHaveBeenCalledTimes(1);
  });

  test('Test creating container', async () => {
    const expectedContainerId = 'testContainerId';
    const containerRequest: ContainerRequest = {
      id: expectedContainerId,
      partitionKey: {
        paths: ['/callId']
      }
    };

    const config = getServerConfig();
    const cosmosClient = new CosmosClient(config);

    jest
      .spyOn(Containers.prototype, 'createIfNotExists')
      .mockResolvedValueOnce({ container: { id: expectedContainerId } } as ContainerResponse);

    await cosmosClient.createContainer(containerRequest);

    const createdContainer = cosmosClient.getContainer();

    expect(createdContainer!.id).toBe(expectedContainerId);
  });

  test('Test if container is undefined without calling createContainer', () => {
    const config = getServerConfig();
    const cosmosClient = new CosmosClient(config);

    expect(cosmosClient.getContainer()).toBeUndefined();
  });

  test("Test createIfNotExists doesn't get trigger when container already exists", async () => {
    const expectedContainerId = 'testContainerId';
    const containerRequest: ContainerRequest = {
      id: expectedContainerId,
      partitionKey: {
        paths: ['/callId']
      }
    };

    const config = getServerConfig();
    const cosmosClient = new CosmosClient(config);

    const mockedCreateIfNotExists = jest
      .spyOn(Containers.prototype, 'createIfNotExists')
      .mockResolvedValueOnce({ container: { id: expectedContainerId } } as ContainerResponse);

    // Call createContainer to run at the beginning.
    await cosmosClient.createContainer(containerRequest);

    expect(cosmosClient.getContainer()).not.toBeUndefined();

    await cosmosClient.createContainer(containerRequest);

    // Expected to be called only once even we called createContainer twice.
    expect(mockedCreateIfNotExists).toHaveBeenCalledTimes(1);
  });

  test('Test upsert item', async () => {
    const testContainerId = 'testContainerId';
    const testInputData: any = {
      sessionId: 'test_session_id',
      callId: 'test_call_id',
      acsUserId: 'test_acs_user_id',
      response: true
    };

    let upsertResult;

    jest
      .spyOn(Items.prototype, 'upsert')
      .mockImplementationOnce((result): Promise<any> => Promise.resolve((upsertResult = result)));

    const config = getServerConfig();
    const cosmosClient = new CosmosClient(config);

    await cosmosClient.upsert(testContainerId, testInputData);

    expect(upsertResult).toBe(testInputData);
  });
});
