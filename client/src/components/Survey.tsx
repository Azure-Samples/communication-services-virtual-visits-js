// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { Link, Stack } from '@fluentui/react';
import { CustomSurveyOptions, MSFormsSurveyOptions, PostCallConfig } from '../models/ConfigModel';
import { rejoinLinkStyle, surveyIframeStyle, surveyStyle } from '../styles/Survey.styles';

export interface SurveyProps {
  onRejoinCall: () => void;
  postCall: PostCallConfig;
}
const SURVEY = 'SurveyComponent';

export const Survey: React.FunctionComponent<SurveyProps> = (props: SurveyProps) => {
  const surveyType = props.postCall.survey?.type;
  let postcallSurveyUrl = '';
  if (surveyType === 'msforms') {
    const options: MSFormsSurveyOptions = props.postCall.survey?.options as MSFormsSurveyOptions;
    postcallSurveyUrl = options.surveyUrl;
  } else if (surveyType === 'custom') {
    const options: CustomSurveyOptions = props.postCall.survey?.options as CustomSurveyOptions;
    postcallSurveyUrl = options.surveyUrl;
  } else {
    postcallSurveyUrl = '';
  }
  return (
    <Stack styles={surveyStyle}>
      <iframe title={SURVEY} style={surveyIframeStyle} src={postcallSurveyUrl} scrolling="yes"></iframe>
      <Stack horizontalAlign="center" verticalAlign="center" styles={rejoinLinkStyle}>
        <Link
          onClick={() => {
            void props.onRejoinCall();
          }}
        >
          {'or re-join the call'}
        </Link>
      </Stack>
    </Stack>
  );
};
