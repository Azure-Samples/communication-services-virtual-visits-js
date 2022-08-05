// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ServerConfigModel } from '../models/configModel';
import DefaultConfig from '../defaultConfig.json';

// for mocking DefaultConfig in unit tests
export const getDefaultConfig = (): ServerConfigModel => DefaultConfig;
