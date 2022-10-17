// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PostCallOneQuestionPollProps, PostCallOneQuestionPoll } from './PostCallOneQuestionPoll';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Theme } from '@fluentui/theme';
import { getTheme, IconButton, Rating, setIconOptions, TextField } from '@fluentui/react';
import { OneQuestionPollOptions } from '../../models/ConfigModel';
// Disable icon warnings for tests as we don't register the icons for unit tests which causes warnings.
// See: https://github.com/microsoft/fluentui/wiki/Using-icons#test-scenarios
setIconOptions({
  disableWarnings: true
});
configure({ adapter: new Adapter() });
const mockAcsUserId = 'mockAcsUserId';
const mockCallId = 'mockCallId';
const mockTheme: Theme = getTheme();

afterEach(() => {
  jest.resetAllMocks();
});

describe('PostCallOneQuestionPoll', () => {
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
      />
    );
    const textField = postCallOneQuestionPoll.find(TextField);
    expect(textField.length).toBe(1);
  });
});
