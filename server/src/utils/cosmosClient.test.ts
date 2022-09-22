// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Containers, ContainerResponse, Database, Databases, DatabaseResponse } from '@azure/cosmos';
import { createDatabase, createContainer } from './cosmosClient';

jest.spyOn(Database.prototype, 'read').mockResolvedValueOnce({ database: { id: 'testing' } } as DatabaseResponse);

describe('Test cosmosClient', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    delete process.env.VV_COSMOS_DB_CONNECTION_STRING;
  });

  test('Initialize cosmosClient when VV_COSMOS_DB_CONNECTION_STRING present.', async () => {
    const expectedEndpoint = 'https://testinghost/';
    const expectedAccountKey = 'testAccountKey';
    process.env.VV_COSMOS_DB_CONNECTION_STRING = `AccountEndpoint=${expectedEndpoint};AccountKey=${expectedAccountKey}`;

    const cosmosClientModule = await import('./cosmosClient');
    const cosmosClient = cosmosClientModule.cosmosClient;

    const endpoint = cosmosClient['clientContext']['cosmosClientOptions']['endpoint'];
    const accountKey = cosmosClient['clientContext']['cosmosClientOptions']['key'];

    expect(expectedEndpoint).toBe(endpoint);
    expect(expectedAccountKey).toBe(accountKey);
  });

  test('Initialize cosmosClient when VV_COSMOS_DB_CONNECTION_STRING not present.', async () => {
    const cosmosClientModule = await import('./cosmosClient');
    const cosmosClient = cosmosClientModule.cosmosClient;

    expect(cosmosClient['clientContext']['cosmosClientOptions']).not.toHaveProperty('key');
  });

  test('Test creating database', async () => {
    const expectedDatabaseId = 'testDatabaseId';

    jest
      .spyOn(Databases.prototype, 'createIfNotExists')
      .mockResolvedValueOnce({ database: { id: expectedDatabaseId } } as DatabaseResponse);

    const database = await createDatabase();

    expect(database.id).toBe(expectedDatabaseId);
  });

  test('Test creating container', async () => {
    const expectedContainerId = 'testingContainerId';

    jest
      .spyOn(Containers.prototype, 'createIfNotExists')
      .mockResolvedValueOnce({ container: { id: expectedContainerId } } as ContainerResponse);

    const container = await createContainer();

    expect(container.id).toBe(expectedContainerId);
  });
});
