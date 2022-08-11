// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CosmosClient, CosmosClientOptions } from '@azure/cosmos';
import { DefaultAzureCredential } from '@azure/identity';

const databaseId = 'VirtualVisitsDb';
const containerId = 'ACSUsers';
const partitionKey = { kind: 'Hash', paths: ['/'] };

/**
 * CosmosEndpoint - the endpoint of the CosmosDB resource
 * This should be part of the config as environment variable
 */
const cosmosEndpoint = '<CosmosDB Endpoint>';
const credential = new DefaultAzureCredential(); // no secret needed!

const options: CosmosClientOptions = {
  endpoint: cosmosEndpoint,
  // key: '', // managed identity method does not need a key,
  aadCredentials: credential,
  userAgentSuffix: 'VVCosmosDBExample'
};

export class VVCosmosClient {
  private _client: CosmosClient;

  constructor() {
    this._client = new CosmosClient(options);
  }

  /**
   * Create the database if it does not exist
   */
  async createDatabase() {
    const { database } = await this._client.databases.createIfNotExists({
      id: databaseId
    });
    console.log(`Created database:\n${database.id}\n`);
  }

  /**
   * Create the container if it does not exist
   */
  async createContainer() {
    const { container } = await this._client
      .database(databaseId)
      .containers.createIfNotExists({ id: containerId, partitionKey });
    console.log(`Created container:\n${container.id}\n`);
  }

  /**
   * Create item if it does not exist
   */
  async createItem(itemBody) {
    const { item } = await this._client.database(databaseId).container(containerId).items.upsert(itemBody);
    console.log(`Created item with id:\n${item.id}\n`);
  }

  /**
   * Query the container using SQL
   */
  async queryContainer() {
    console.log(`Querying container:\n${containerId}`);

    const querySpec = {
      query: 'SELECT VALUE r.children FROM root r'
    };

    const { resources: results } = await this._client
      .database(databaseId)
      .container(containerId)
      .items.query(querySpec)
      .fetchAll();
    for (var queryResult of results) {
      let resultString = JSON.stringify(queryResult);
      console.log(`\tQuery returned ${resultString}\n`);
    }
  }
}
