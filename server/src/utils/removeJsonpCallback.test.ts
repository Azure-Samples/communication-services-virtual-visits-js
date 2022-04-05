// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { NextFunction, Request, Response } from 'express';
import removeJsonpCallback from './removeJsonpCallback';

describe('removeJsonpCallback middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const nextFunction: NextFunction = jest.fn();

  test('removes jsonp callback query param', async () => {
    const callbackFunctionName = 'test_callback_function';
    mockRequest = {
      query: {
        callback: callbackFunctionName
      }
    };

    removeJsonpCallback(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockRequest.query?.callback).toEqual(undefined);
    expect(nextFunction).toBeCalledTimes(1);
  });
});
