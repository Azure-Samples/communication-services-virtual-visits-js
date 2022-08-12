// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationIdentityClient } from '@azure/communication-identity';
import { getDefaultConfig } from '../utils/getDefaultConfig';
import { tokenController } from './tokenController';
import { NextFunction } from 'express';
import { ServerConfigModel } from '../models/configModel';

function createMockedResponseObject(): any {
  const res: any = {};
  res.status = (status) => {
    res.lastStatus = status;
    return res;
  };
  res.json = (json) => {
    res.lastJson = json;
    return res;
  };
  return res;
}

describe('tokenController', () => {
  const cfg = getDefaultConfig() as ServerConfigModel;
  const mockClient = {
    createUserAndToken: async (scopes) => {
      requestedScopes = scopes;
      return {};
    }
  };
  let requestedScopes: any;
  const mockResponse = createMockedResponseObject();
  const mockNextFunction: NextFunction = jest.fn();

  test('should request only voip scope when chat is disabled', () => {
    cfg.chatEnabled = false;

    const controller = tokenController(mockClient as CommunicationIdentityClient, cfg);
    controller({} as any, mockResponse, mockNextFunction);

    expect(requestedScopes).toEqual(['voip']);
  });

  test('should request both chat and voip scopes when chat is enabled', () => {
    cfg.chatEnabled = true;

    const controller = tokenController(mockClient as CommunicationIdentityClient, cfg);
    controller({} as any, mockResponse, mockNextFunction);

    expect(requestedScopes).toEqual(expect.arrayContaining(['voip', 'chat']));
  });

  test('delegates errors to other handlers with next()', () => {
    cfg.chatEnabled = true;
    const invalidClient = {};

    const controller = tokenController(invalidClient as CommunicationIdentityClient, cfg);
    controller({} as any, mockResponse, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalledTimes(1);
  });
});
