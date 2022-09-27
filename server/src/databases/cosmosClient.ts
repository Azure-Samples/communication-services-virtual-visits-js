// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CosmosClient as AzureCosmosClient,
  CosmosClientOptions,
  ContainerRequest,
  Container,
  Database
} from '@azure/cosmos';
import { DefaultAzureCredential } from '@azure/identity';
import { ServerConfigModel } from '../models/configModel';

class CosmosClient extends AzureCosmosClient {
  private _cosmosDBName: string;
  private _database: Database | undefined;
  private _container: Container | undefined;

  constructor({ cosmosDBConnectionString, cosmosDBEndpoint, cosmosDBName }: ServerConfigModel) {
    const cosmosClientOptions: CosmosClientOptions = {
      endpoint: cosmosDBEndpoint,
      aadCredentials: new DefaultAzureCredential()
    };

    if (cosmosDBConnectionString) {
      super(cosmosDBConnectionString);
    } else {
      super(cosmosClientOptions);
    }

    this._cosmosDBName = cosmosDBName;
    this._database = undefined;
    this._container = undefined;
  }

  async createDatabase(): Promise<void> {
    if (this._database === undefined) {
      const { database } = await this.databases.createIfNotExists({
        id: this._cosmosDBName
      });

      this._database = database;
    }
  }

  async createContainer(containerRequest: ContainerRequest): Promise<void> {
    if (this._container === undefined) {
      const { container } = await this.database(this._cosmosDBName).containers.createIfNotExists(containerRequest);

      this._container = container;
    }
  }

  async upsert(containerId: string, item: any): Promise<void> {
    await this.database(this._cosmosDBName).container(containerId).items.upsert(item);
  }

  getDatabase() {
    return this._database;
  }

  getContainer() {
    return this._container;
  }
}

export default CosmosClient;
