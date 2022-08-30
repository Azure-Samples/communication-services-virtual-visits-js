// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Survey, SurveyProps } from './Survey';
import { PostCallConfig } from '../models/ConfigModel';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

const mockPostCall: PostCallConfig = {
  survey: {
    type: 'msforms',
    options: {
      surveyUrl: 'dummySurveyUrl'
    }
  }
};

describe('Survey', () => {
  it('should render', async () => {
    const survey = await mount<SurveyProps>(<Survey postCall={mockPostCall} onRejoinCall={jest.fn()} />);
    expect(survey.find('iframe').length).toBe(1);
    expect(survey.props().postCall?.survey?.type).toBe(mockPostCall.survey?.type);
    expect(survey.props().postCall?.survey?.options.surveyUrl).toBe(mockPostCall.survey?.options.surveyUrl);
  });
});
