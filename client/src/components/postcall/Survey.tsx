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
import { fullScreenStyles, rejoinLinkStyle, surveyIframeStyle, surveyStyle } from '../../styles/Survey.styles';
import { RejoinLink } from './RejoinLink';
import { PostCallOneQuestionPoll } from './PostCallOneQuestionPoll';
import MobileDetect from 'mobile-detect';
import {
  mainJoinTeamsMeetingContainerMobileStyles,
  mainJoinTeamsMeetingContainerStyles
} from '../../styles/JoinTeamsMeeting.Styles';

export interface SurveyProps {
  theme?: PartialTheme | Theme;
  onRejoinCall: () => void;
  postCall: PostCallConfig;
  callId?: string;
  acsUserId: string;
  onSurveyComplete?: () => void;
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
          <RejoinLink onRejoinCall={props.onRejoinCall}></RejoinLink>
        </Stack>
      </Stack>
    );
  } else if (surveyType === 'onequestionpoll') {
    const oneQuestionPollOptions: OneQuestionPollOptions = props.postCall.survey.options as OneQuestionPollOptions;
    const containerStyles = new MobileDetect(window.navigator.userAgent).mobile()
      ? mainJoinTeamsMeetingContainerMobileStyles(props.theme)
      : mainJoinTeamsMeetingContainerStyles(props.theme);

    return (
      <Stack styles={fullScreenStyles} horizontalAlign="center" verticalAlign="center">
        <Stack styles={containerStyles} tokens={{ childrenGap: 15 }}>
          <PostCallOneQuestionPoll
            theme={props.theme}
            oneQuestionPollOptions={oneQuestionPollOptions}
            callId={props.callId}
            acsUserId={props.acsUserId}
            onSurveyComplete={props.onSurveyComplete}
          />
          <Stack horizontalAlign="center" verticalAlign="center" styles={rejoinLinkStyle}>
            <RejoinLink onRejoinCall={props.onRejoinCall}></RejoinLink>
          </Stack>
        </Stack>
      </Stack>
    );
  }
  return <></>;
};
