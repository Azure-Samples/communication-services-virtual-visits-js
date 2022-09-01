// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { Link, Stack } from '@fluentui/react';
import { PostCallConfig } from '../models/ConfigModel';
import { rejoinLinkStyle, surveyIframeStyle, surveyStyle } from '../styles/Survey.styles';

export interface SurveyProps {
  onRejoinCall: () => void;
  postCall: PostCallConfig;
}
const SURVEY = 'SurveyComponent';

export const Survey: React.FunctionComponent<SurveyProps> = (props: SurveyProps) => {
  return (
    <Stack styles={surveyStyle}>
      <iframe
        title={SURVEY}
        style={surveyIframeStyle}
        src={props.postCall.survey?.options.surveyUrl}
        scrolling="yes"
      ></iframe>
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
