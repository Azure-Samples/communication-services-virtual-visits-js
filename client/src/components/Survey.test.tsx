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
  it('should render iframe with correct url', async () => {
    const survey = await mount<SurveyProps>(<Survey postCall={mockPostCall} onRejoinCall={jest.fn()} />);
    const iframe = survey.find('iframe');
    expect(iframe.length).toBe(1);
    expect(iframe.props().src).toEqual(mockPostCall.survey.options.surveyUrl);
  });
});
