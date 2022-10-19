// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ServerConfigModel } from '../models/configModel';
import getCosmosDBConfig from './getCosmosDbConfig';

describe('getCosmosDbConfig', () => {
  beforeEach(() => {
    delete process.env.VV_COSMOS_DB_NAME;
    delete process.env.VV_COSMOS_DB_CONNECTION_STRING;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return undefined if cosmosDb is undefined', () => {
    const mockDefaultConfig: ServerConfigModel = {
      communicationServicesConnectionString: 'dummy endpoint',
      microsoftBookingsUrl: 'dummyBookingsUrl',
      chatEnabled: true,
      screenShareEnabled: true,
      companyName: 'test Healthcare',
      colorPalette: '#0078d4',
      waitingTitle: 'Thank you for choosing Lamna Healthcare',
      waitingSubtitle: 'Your clinician is joining the meeting',
      logoUrl: ''
    };

    const result = getCosmosDBConfig(mockDefaultConfig);

    expect(result).toBeUndefined();
  });

  it('should return config with connection string if environment variables are set', () => {
    const expectedDbName = 'my db name';
    const expectedConnectionString = 'my conn string';

    process.env.VV_COSMOS_DB_NAME = expectedDbName;
    process.env.VV_COSMOS_DB_CONNECTION_STRING = expectedConnectionString;

    const mockDefaultConfig: ServerConfigModel = {
      communicationServicesConnectionString: 'dummy endpoint',
      microsoftBookingsUrl: 'dummyBookingsUrl',
      chatEnabled: true,
      screenShareEnabled: true,
      companyName: 'test Healthcare',
      colorPalette: '#0078d4',
      waitingTitle: 'Thank you for choosing Lamna Healthcare',
      waitingSubtitle: 'Your clinician is joining the meeting',
      logoUrl: '',
      cosmosDb: {
        dbName: 'some random db name',
        connectionString: 'some random connection string'
      }
    };

    const result = getCosmosDBConfig(mockDefaultConfig);

    expect(result).toStrictEqual({
      dbName: expectedDbName,
      connectionString: expectedConnectionString
    });
  });

  it('should return config with connection string from defaultConfig if environment variables are not set', () => {
    const expectedDbName = 'my db name';
    const expectedConnectionString = 'my conn string';

    const mockDefaultConfig: ServerConfigModel = {
      communicationServicesConnectionString: 'dummy endpoint',
      microsoftBookingsUrl: 'dummyBookingsUrl',
      chatEnabled: true,
      screenShareEnabled: true,
      companyName: 'test Healthcare',
      colorPalette: '#0078d4',
      waitingTitle: 'Thank you for choosing Lamna Healthcare',
      waitingSubtitle: 'Your clinician is joining the meeting',
      logoUrl: '',
      cosmosDb: {
        dbName: expectedDbName,
        connectionString: expectedConnectionString
      }
    };

    const result = getCosmosDBConfig(mockDefaultConfig);

    expect(result).toStrictEqual({
      dbName: expectedDbName,
      connectionString: expectedConnectionString
    });
  });
});
