// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Survey, SurveyProps } from './Survey';
import { MSFormsSurveyOptions, PostCallConfig } from '../models/ConfigModel';
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
    const options: MSFormsSurveyOptions = mockPostCall.survey?.options as MSFormsSurveyOptions;
    expect(iframe.length).toBe(1);
    expect(iframe.props().src).toEqual(options.surveyUrl);
  });
});
