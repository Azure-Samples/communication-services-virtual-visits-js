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
  private cosmosDBName: string;

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

    this.cosmosDBName = cosmosDBName;
  }

  async createDatabase(): Promise<Database> {
    const { database } = await this.databases.createIfNotExists({
      id: this.cosmosDBName
    });

    return database;
  }

  async createContainer(containerRequest: ContainerRequest): Promise<Container> {
    const { container } = await this.database(this.cosmosDBName).containers.createIfNotExists(containerRequest);

    return container;
  }

  async upsert(containerId: string, item: any): Promise<void> {
    await this.database(this.cosmosDBName).container(containerId).items.upsert(item);
  }
}

export default CosmosClient;
