// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AppConfigModel } from '../models/ConfigModel';
import { generateTheme } from './ThemeGenerator';
import createError from 'http-errors';

export async function fetchConfig(): Promise<AppConfigModel | undefined> {
  const response = await fetch('/api/config', { method: 'GET' });
  if (response.status !== 200) {
    throw new createError(
      response.status,
      `Unable to retrieve config. Status: ${response.status}. Message: ${response.statusText}.`
    );
  }

  const responseContent = await response.text();
  const config = JSON.parse(responseContent);
  if (!config) {
    throw new Error(`Received empty config response.`);
  }

  const appConfigModel: AppConfigModel = {
    ...config,
    theme: generateTheme(config.colorPalette)
  };

  return appConfigModel;
}
