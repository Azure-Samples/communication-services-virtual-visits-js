// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PostCallOneQuestionPollProps, PostCallOneQuestionPoll } from './PostCallOneQuestionPoll';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Theme } from '@fluentui/theme';
import { getTheme, IconButton, Rating, TextField } from '@fluentui/react';
import { OneQuestionPollOptions } from '../../models/ConfigModel';

configure({ adapter: new Adapter() });
const mockAcsUserId = 'mockAcsUserId';
const mockCallId = 'mockCallId';
const mockTheme: Theme = getTheme();
// const mockRequest: any = {
//   callId: mockCallId,
//   acsUserId: mockAcsUserId,
//   response: true
// };

global.fetch = jest.fn(() => {
  Promise.resolve({
    status: 400
  });
}) as jest.Mock;

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
        oneQuestionPollInfo={mockOneQuestionPollInfo}
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
        oneQuestionPollInfo={mockOneQuestionPollInfo}
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
        oneQuestionPollInfo={mockOneQuestionPollInfo}
        callId={mockCallId}
        acsUserId={mockAcsUserId}
      />
    );
    const textField = postCallOneQuestionPoll.find(TextField);
    expect(textField.length).toBe(1);
  });

  it('throws error if response status is not 200', async () => {
    const mockStatus = 400;
    (fetch as jest.Mock).mockImplementation(() => {
      return Promise.resolve({
        status: mockStatus
      });
    });
    try {
      //implementation for testing submitSurveyResult
      //   const mockOneQuestionPollInfo: OneQuestionPollOptions = {
      //     title: '',
      //     prompt: '',
      //     pollType: 'text',
      //     answerPlaceholder: '',
      //     saveButtonText: ''
      //   };
      //   const postCallOneQuestionPoll = await mount<PostCallOneQuestionPollProps>(
      //     <PostCallOneQuestionPoll
      //       theme={mockTheme}
      //       oneQuestionPollInfo={mockOneQuestionPollInfo}
      //       callId={mockCallId}
      //       acsUserId={mockAcsUserId}
      //     />
      //   );
      //   const primaryButton = postCallOneQuestionPoll.find(PrimaryButton);
      //   primaryButton.simulate('click');
    } catch (e) {
      expect(e.message).toEqual('Could not insert into DB');
    }
  });
});
