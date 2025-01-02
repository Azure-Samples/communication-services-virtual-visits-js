// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Survey } from './Survey';
import { MSFormsSurveyOptions, PostCallConfig } from '../../models/ConfigModel';
import { render } from '@testing-library/react';

describe('Survey', () => {
  it('should render iframe with correct url', async () => {
    const mockPostCall: PostCallConfig = {
      survey: {
        type: 'msforms',
        options: {
          surveyUrl: 'dummySurveyUrl'
        }
      }
    };
    const survey = await render(
      <Survey
        callId="mockCallId"
        acsUserId="mockAcsUserId"
        meetingLink="mockMeetingLink"
        postCall={mockPostCall}
        onRejoinCall={jest.fn()}
      />
    );
    const iframe = survey.getByTitle('SurveyComponent');
    const options: MSFormsSurveyOptions = mockPostCall.survey?.options as MSFormsSurveyOptions;
    expect(iframe.getAttribute('src')).toEqual(options.surveyUrl);
  });

  it('should render PostCallOneQuestionPoll component', async () => {
    const mockPostCall: PostCallConfig = {
      survey: {
        type: 'onequestionpoll',
        options: {
          title: 'mock',
          prompt: 'mock',
          pollType: 'text',
          answerPlaceholder: 'Enter your comments here...',
          saveButtonText: 'Continue'
        }
      }
    };
    const survey = await render(
      <Survey
        callId="mockCallId"
        acsUserId="mockAcsUserId"
        meetingLink="mockMeetingLink"
        postCall={mockPostCall}
        onRejoinCall={jest.fn()}
      />
    );
    const postCallOneQuestionPoll = survey.queryAllByTestId('post-call-poll');
    expect(postCallOneQuestionPoll.length).toBe(1);
  });
});
