// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { PartialTheme, Stack, Theme } from '@fluentui/react';
import {
  CustomSurveyOptions,
  MSFormsSurveyOptions,
  PostCallConfig,
  OneQuestionPollOptions
} from '../../models/ConfigModel';
import {
  fullScreenStyles,
  oneQuestionPollStyle,
  rejoinLinkStyle,
  surveyIframeStyle,
  surveyStyle
} from '../../styles/Survey.styles';
import { RejoinLink } from './RejoinLink';
import { PostCallOneQuestionPoll } from './PostCallOneQuestionPoll';

export interface SurveyProps {
  theme?: PartialTheme | Theme;
  onRejoinCall: () => void;
  postCall: PostCallConfig;
  callId?: string;
  acsUserId: string;
  meetingLink: string;
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
  }

  if (surveyType === 'msforms' || surveyType === 'custom') {
    return (
      <Stack styles={surveyStyle}>
        <iframe title={SURVEY} style={surveyIframeStyle} src={postcallSurveyUrl} scrolling="yes"></iframe>
        <Stack horizontalAlign="center" verticalAlign="center" styles={rejoinLinkStyle}>
          <RejoinLink onRejoinCall={props.onRejoinCall} />
        </Stack>
      </Stack>
    );
  } else if (surveyType === 'onequestionpoll') {
    const oneQuestionPollOptions: OneQuestionPollOptions = props.postCall.survey.options as OneQuestionPollOptions;
    return (
      <Stack styles={fullScreenStyles}>
        <Stack styles={oneQuestionPollStyle(props.theme)} tokens={{ childrenGap: 15 }}>
          <PostCallOneQuestionPoll
            theme={props.theme}
            oneQuestionPollOptions={oneQuestionPollOptions}
            callId={props.callId}
            acsUserId={props.acsUserId}
            meetingLink={props.meetingLink}
          />
          <Stack horizontalAlign="center" verticalAlign="center" styles={rejoinLinkStyle}>
            <RejoinLink onRejoinCall={props.onRejoinCall} />
          </Stack>
        </Stack>
      </Stack>
    );
  }
  return <></>;
};
