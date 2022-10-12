// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { submitSurveyResponse } from './PostCallUtil';

global.fetch = jest.fn(() => {
  Promise.resolve({
    status: 200
  });
}) as jest.Mock;

afterEach(() => {
  jest.resetAllMocks();
});

describe('PostCallUtil', () => {
  it('calls fetch to post surveyResponse', async () => {
    const mockStatus = 200;
    const mockCallId = 'mockCallId';
    const mockAcsUserId = 'mockAcsUserId';
    const mockPollResponse = 'mockPollResponse';
    const mockResponse = jest.fn();
    Object.defineProperty(window, 'location', {
      value: {
        hash: {
          endsWith: mockResponse,
          includes: mockResponse
        },
        assign: mockResponse,
        replace: mockResponse
      },
      writable: true
    });

    (fetch as jest.Mock).mockImplementation(() => {
      return Promise.resolve({
        status: mockStatus
      });
    });

    await submitSurveyResponse(mockCallId, mockAcsUserId, mockPollResponse);
    expect(fetch).toHaveBeenCalled();
    expect(mockResponse).toHaveBeenCalled();
  });

  it('throws error if response status code is not 200', async () => {
    const mockStatus = 400;
    const mockCallId = 'mockCallId';
    const mockAcsUserId = 'mockAcsUserId';
    const mockPollResponse = 'mockPollResponse';

    const mockResponse = jest.fn();
    Object.defineProperty(window, 'location', {
      value: {
        hash: {
          endsWith: mockResponse,
          includes: mockResponse
        },
        assign: mockResponse,
        replace: mockResponse
      },
      writable: true
    });

    (fetch as jest.Mock).mockImplementation(() => {
      return Promise.resolve({
        status: mockStatus
      });
    });

    try {
      await submitSurveyResponse(mockCallId, mockAcsUserId, mockPollResponse);
    } catch (err) {
      expect(err).toEqual('Error during insertion');
      expect(window.location.replace).toHaveBeenCalled();
    }
  });
});
