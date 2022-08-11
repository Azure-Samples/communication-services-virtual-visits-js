// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getDefaultConfig } from './getDefaultConfig';
import DefaultConfig from '../defaultConfig.json';

describe('getDefaultConfig', () => {
  test('should return default.json', () => {
    const config = getDefaultConfig();
    expect(config.communicationServicesConnectionString).toBe(DefaultConfig.communicationServicesConnectionString);
    expect(config.microsoftBookingsUrl).toBe(DefaultConfig.microsoftBookingsUrl);
    expect(config.chatEnabled).toBe(DefaultConfig.chatEnabled);
    expect(config.screenShareEnabled).toBe(DefaultConfig.screenShareEnabled);
    expect(config.companyName).toBe(DefaultConfig.companyName);
    expect(config.colorPalette).toBe(DefaultConfig.colorPalette);
    expect(config.waitingTitle).toBe(DefaultConfig.waitingTitle);
    expect(config.waitingSubtitle).toBe(DefaultConfig.waitingSubtitle);
  });
});
