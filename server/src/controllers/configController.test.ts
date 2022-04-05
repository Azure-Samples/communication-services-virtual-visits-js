// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ServerConfigModel } from '../models/configModel';
import { configController } from './configController';
import { NextFunction } from 'express';

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

describe('configController', () => {
  const mockNextFunction: NextFunction = jest.fn();

  test('should return config json without the connection string', async () => {
    const cfg: ServerConfigModel = {
      communicationServicesConnectionString: 'endpoint=test_endpoint;accesskey=secret',
      microsoftBookingsUrl: 'str2',
      chatEnabled: true,
      screenShareEnabled: true,
      companyName: 'str3',
      colorPalette: 'str4',
      waitingTitle: 'str5',
      waitingSubtitle: 'str6',
      logoUrl: 'str7'
    };
    const controller = configController(cfg);
    const resp = createMockedResponseObject();
    controller({} as any, resp, mockNextFunction);

    expect(resp.lastStatus).toBe(200);

    expect(resp.lastJson.communicationEndpoint).toBe('test_endpoint');
    expect(resp.lastJson.microsoftBookingsUrl).toBe('str2');
    expect(resp.lastJson.chatEnabled).toBeTruthy();
    expect(resp.lastJson.screenShareEnabled).toBeTruthy();
    expect(resp.lastJson.companyName).toBe('str3');
    expect(resp.lastJson.colorPalette).toBe('str4');
    expect(resp.lastJson.waitingTitle).toBe('str5');
    expect(resp.lastJson.waitingSubtitle).toBe('str6');
    expect(resp.lastJson.logoUrl).toBe('str7');
  });

  test('delegates errors to other handlers with next()', () => {
    const invalidConfig: ServerConfigModel = {
      communicationServicesConnectionString: '',
      microsoftBookingsUrl: '',
      chatEnabled: true,
      screenShareEnabled: true,
      companyName: '',
      colorPalette: '',
      waitingTitle: '',
      waitingSubtitle: '',
      logoUrl: ''
    };
    const controller = configController(invalidConfig);
    const resp = createMockedResponseObject();
    controller({} as any, resp, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalledTimes(1);
  });
});
