// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationUserToken } from '@azure/communication-identity';
import { fetchToken } from './FetchToken';

let fetchBackup: any = undefined;

beforeEach(() => {
  fetchBackup = global.fetch;
});

afterEach(() => {
  global.fetch = fetchBackup;
});

describe('FetchToken', () => {
  test('Should return CommunicationUserToken value when successfull', async () => {
    const mockToken: CommunicationUserToken = {
      user: { communicationUserId: 'userId' },
      token: 'token',
      expiresOn: new Date()
    };

    global.fetch = jest.fn(
      (_: RequestInfo | URL, __?: RequestInit | undefined): Promise<Response> => {
        return Promise.resolve<Response>({
          status: 200,
          text: () => Promise.resolve(JSON.stringify(mockToken))
        } as Response);
      }
    );

    const token = await fetchToken();

    expect(token).toStrictEqual(mockToken);
  });
});
