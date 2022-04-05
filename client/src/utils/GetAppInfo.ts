// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { appName, appVersion } from '../telemetryAppInfo';

// Application name to be included in telemetry data
export const getApplicationName = (): string => appName;

// Application version to be included in telemetry data
export const getApplicationVersion = (): string | undefined => appVersion;
