// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PostCallOneQuestionPollProps, PostCallOneQuestionPoll } from './PostCallOneQuestionPoll';
import { mount } from 'enzyme';
import { Theme } from '@fluentui/theme';
import { getTheme, IconButton, Rating, TextField, PrimaryButton, Spinner } from '@fluentui/react';
import { OneQuestionPollOptions } from '../../models/ConfigModel';
import * as PostCallUtil from '../../utils/PostCallUtil';

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
    const postCallOneQuestionPoll = await mount<PostCallOneQuestionPollProps>(
      <PostCallOneQuestionPoll
        theme={mockTheme}
        oneQuestionPollOptions={mockOneQuestionPollInfo}
        callId={mockCallId}
        acsUserId={mockAcsUserId}
        meetingLink={mockMeetingLink}
      />
    );
    const iconButton = postCallOneQuestionPoll.find(IconButton);
    expect(iconButton.length).toBe(2);
  });

  it('should render correct input type when polltype is rating', async () => {
    const mockOneQuestionPollInfo: OneQuestionPollOptions = {
      title: '',
      prompt: '',
      pollType: 'rating',
      answerPlaceholder: '',
      saveButtonText: ''
    };
    const postCallOneQuestionPoll = await mount<PostCallOneQuestionPollProps>(
      <PostCallOneQuestionPoll
        theme={mockTheme}
        oneQuestionPollOptions={mockOneQuestionPollInfo}
        callId={mockCallId}
        acsUserId={mockAcsUserId}
        meetingLink={mockMeetingLink}
      />
    );
    const rating = postCallOneQuestionPoll.find(Rating);
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
    const postCallOneQuestionPoll = await mount<PostCallOneQuestionPollProps>(
      <PostCallOneQuestionPoll
        theme={mockTheme}
        oneQuestionPollOptions={mockOneQuestionPollInfo}
        callId={mockCallId}
        acsUserId={mockAcsUserId}
        meetingLink={mockMeetingLink}
      />
    );
    const textField = postCallOneQuestionPoll.find(TextField);
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
    const postCallOneQuestionPoll = await mount<PostCallOneQuestionPollProps>(
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

    const button = postCallOneQuestionPoll.find(PrimaryButton);
    await button.simulate('click');
    const spinner = postCallOneQuestionPoll.find(Spinner);
    expect(spinner).toBeDefined();
    expect(mockSubmitSurveyResponseUtil).toHaveBeenCalled();
  });
});
