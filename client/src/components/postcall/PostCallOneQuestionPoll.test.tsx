// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getTheme } from '@fluentui/react';
import { Theme } from '@fluentui/theme';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { OneQuestionPollOptions } from '../../models/ConfigModel';
import * as PostCallUtil from '../../utils/PostCallUtil';
import { PostCallOneQuestionPoll } from './PostCallOneQuestionPoll';

const mockAcsUserId = 'mockAcsUserId';
const mockCallId = 'mockCallId';
const mockMeetingLink = 'mockMeetingLink';
const mockTheme: Theme = getTheme();

const mockReplace = jest.fn();

describe('PostCallOneQuestionPoll', () => {
  const originalwindowLocation = window.location;

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: {
        replace: mockReplace
      },
      writable: true
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    window.location = originalwindowLocation;
  });

  it('should render correct input type when polltype is likeOrDislike', async () => {
    const mockOneQuestionPollInfo: OneQuestionPollOptions = {
      title: '',
      prompt: '',
      pollType: 'likeOrDislike',
      answerPlaceholder: '',
      saveButtonText: ''
    };
    const postCallOneQuestionPoll = await render(
      <PostCallOneQuestionPoll
        theme={mockTheme}
        oneQuestionPollOptions={mockOneQuestionPollInfo}
        callId={mockCallId}
        acsUserId={mockAcsUserId}
        meetingLink={mockMeetingLink}
      />
    );
    const likeButtons = await postCallOneQuestionPoll.queryAllByTestId('poll-input-like-button');
    expect(likeButtons.length).toBe(1);
    const dislikeButtons = await postCallOneQuestionPoll.queryAllByTestId('poll-input-dislike-button');
    expect(dislikeButtons.length).toBe(1);
  });

  it('should render correct input type when polltype is rating', async () => {
    const mockOneQuestionPollInfo: OneQuestionPollOptions = {
      title: '',
      prompt: '',
      pollType: 'rating',
      answerPlaceholder: '',
      saveButtonText: ''
    };
    const postCallOneQuestionPoll = await render(
      <PostCallOneQuestionPoll
        theme={mockTheme}
        oneQuestionPollOptions={mockOneQuestionPollInfo}
        callId={mockCallId}
        acsUserId={mockAcsUserId}
        meetingLink={mockMeetingLink}
      />
    );
    const rating = postCallOneQuestionPoll.queryAllByTestId('rating');
    expect(rating.length).toBe(1);
  });

  it('should render correct input type when polltype is text', async () => {
    const mockOneQuestionPollInfo: OneQuestionPollOptions = {
      title: '',
      prompt: '',
      pollType: 'text',
      answerPlaceholder: '',
      saveButtonText: ''
    };
    const postCallOneQuestionPoll = await render(
      <PostCallOneQuestionPoll
        theme={mockTheme}
        oneQuestionPollOptions={mockOneQuestionPollInfo}
        callId={mockCallId}
        acsUserId={mockAcsUserId}
        meetingLink={mockMeetingLink}
      />
    );
    const textField = postCallOneQuestionPoll.queryAllByRole('textbox');
    expect(textField.length).toBe(1);
  });

  it('should call submitSurveyResponseUtil when submit button is clicked', async () => {
    const mockOneQuestionPollInfo: OneQuestionPollOptions = {
      title: '',
      prompt: '',
      pollType: 'text',
      answerPlaceholder: '',
      saveButtonText: ''
    };
    const postCallOneQuestionPoll = await render(
      <PostCallOneQuestionPoll
        theme={mockTheme}
        oneQuestionPollOptions={mockOneQuestionPollInfo}
        callId={mockCallId}
        acsUserId={mockAcsUserId}
        meetingLink={mockMeetingLink}
      />
    );

    const mockSubmitSurveyResponseUtil = jest
      .spyOn(PostCallUtil, 'submitSurveyResponseUtil')
      .mockImplementationOnce(jest.fn());

    const button = postCallOneQuestionPoll.getByRole('button');
    React.act(() => {
      fireEvent.click(button);
    });
    const spinner = postCallOneQuestionPoll.getByTestId('spinner');
    expect(spinner).toBeDefined();
    expect(mockSubmitSurveyResponseUtil).toHaveBeenCalled();
  });
});
