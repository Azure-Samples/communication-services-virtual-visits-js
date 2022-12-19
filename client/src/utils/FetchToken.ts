// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationUserToken } from '@azure/communication-identity';
import createError from 'http-errors';

export async function fetchToken(): Promise<CommunicationUserToken | undefined> {
  const response = await fetch('/api/token', { method: 'GET' });

  if (response.status !== 200) {
    throw new createError(
      response.status,
      `Unable to retrieve config. Status: ${response.status}. Message: ${response.statusText}.`
    );
  }

  const responseContent = await response.text();
  const token = JSON.parse(responseContent, parseDate);

  return token;
}

function parseDate(key: string, value: string): Date | string {
  if (key === 'expiresOn') {
    return new Date(value);
  }
  return value;
}
