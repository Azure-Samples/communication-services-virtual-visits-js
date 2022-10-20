// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Survey, SurveyProps } from './Survey';
import { MSFormsSurveyOptions, PostCallConfig } from '../../models/ConfigModel';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { PostCallOneQuestionPoll } from './PostCallOneQuestionPoll';

configure({ adapter: new Adapter() });

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
    const survey = await mount<SurveyProps>(
      <Survey
        callId="mockCallId"
        acsUserId="mockAcsUserId"
        meetingLink="mockMeetingLink"
        postCall={mockPostCall}
        onRejoinCall={jest.fn()}
      />
    );
    const iframe = survey.find('iframe');
    const options: MSFormsSurveyOptions = mockPostCall.survey?.options as MSFormsSurveyOptions;
    expect(iframe.length).toBe(1);
    expect(iframe.props().src).toEqual(options.surveyUrl);
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
    const survey = await mount<SurveyProps>(
      <Survey
        callId="mockCallId"
        acsUserId="mockAcsUserId"
        meetingLink="mockMeetingLink"
        postCall={mockPostCall}
        onRejoinCall={jest.fn()}
      />
    );
    const postCallOneQuestionPoll = survey.find(PostCallOneQuestionPoll);
    expect(postCallOneQuestionPoll.length).toBe(1);
  });
});
