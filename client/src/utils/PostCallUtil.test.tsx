// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { submitSurveyResponse } from './PostCallUtil';

global.fetch = jest.fn(() => {
  Promise.resolve({
    status: 200
  });
}) as jest.Mock;

it('throws error if response status code is not 200', async () => {
  const mockStatus = 400;
  const mockCallId = 'mockCallId';
  const mockAcsUserId = 'mockAcsUserId';
  const mockPollResponse = 'mockPollResponse';

  (fetch as jest.Mock).mockImplementation(() => {
    return Promise.resolve({
      status: mockStatus
    });
  });
  try {
    submitSurveyResponse(mockCallId, mockAcsUserId, mockPollResponse);
  } catch (err) {
    expect(err).toEqual('Error during insertion');
  }
});

it('calls fecth to post surveyResponse', async () => {
  const mockStatus = 200;
  const mockCallId = 'mockCallId';
  const mockAcsUserId = 'mockAcsUserId';
  const mockPollResponse = 'mockPollResponse';
  (fetch as jest.Mock).mockImplementation(() => {
    return Promise.resolve({
      status: mockStatus
    });
  });

  submitSurveyResponse(mockCallId, mockAcsUserId, mockPollResponse);

  expect(fetch).toHaveBeenCalled();
});
