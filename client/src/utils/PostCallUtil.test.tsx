// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { submitSurveyResponseUtil } from './PostCallUtil';

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
    const mockMeetingLink = 'mockMeetingLink';
    const mockPollResponse = 'mockPollResponse';

    (fetch as jest.Mock).mockImplementation(() => {
      return Promise.resolve({
        status: mockStatus
      });
    });

    await submitSurveyResponseUtil(mockCallId, mockAcsUserId, mockMeetingLink, mockPollResponse);
    expect(fetch).toHaveBeenCalled();
  });

  it('throws error if response status code is not 200', async () => {
    const mockStatus = 400;
    const mockCallId = 'mockCallId';
    const mockAcsUserId = 'mockAcsUserId';
    const mockMeetingLink = 'mockMeetingLink';
    const mockPollResponse = 'mockPollResponse';

    (fetch as jest.Mock).mockImplementation(() => {
      return Promise.resolve({
        status: mockStatus
      });
    });

    try {
      await submitSurveyResponseUtil(mockCallId, mockAcsUserId, mockMeetingLink, mockPollResponse);
    } catch (err) {
      expect(err).toEqual('Error during insertion');
    }
  });
});
