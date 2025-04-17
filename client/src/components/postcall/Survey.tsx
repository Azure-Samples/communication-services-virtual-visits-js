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
import { SummarizeResult } from '../../utils/CallAutomationUtils';
import { CallSummaryTile } from '../rooms/transcription/CallSummaryTile';

export interface SurveyProps {
  theme?: PartialTheme | Theme;
  onRejoinCall: () => void;
  postCall: PostCallConfig;
  callId?: string;
  acsUserId: string;
  meetingLink: string;
  serverCallId?: string;
  transcriptionClientOptions?: {
    transcription: 'auto' | 'manual' | 'none';
    summarization: boolean;
  };
  summarizationStatus?: 'InProgress' | 'Complete' | 'None';
  summary?: SummarizeResult;
}
const SURVEY = 'SurveyComponent';

export const Survey: React.FunctionComponent<SurveyProps> = (props: SurveyProps) => {
  const { serverCallId, summarizationStatus, summary, transcriptionClientOptions } = props;
  const transcriptionFeatureEnabled = transcriptionClientOptions?.transcription !== 'none';
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
      <Stack data-testid="survey" styles={surveyStyle}>
        <iframe title={SURVEY} style={surveyIframeStyle} src={postcallSurveyUrl} scrolling="yes"></iframe>
        <Stack horizontalAlign="center" verticalAlign="center" styles={rejoinLinkStyle}>
          <RejoinLink onRejoinCall={props.onRejoinCall} />
        </Stack>
        {summarizationStatus && transcriptionFeatureEnabled && serverCallId && (
          <CallSummaryTile
            serverCallId={serverCallId}
            summarizationStatus={summarizationStatus}
            summary={transcriptionClientOptions?.summarization ? summary?.recap : undefined}
          />
        )}
      </Stack>
    );
  } else if (surveyType === 'onequestionpoll') {
    const oneQuestionPollOptions: OneQuestionPollOptions = props.postCall.survey.options as OneQuestionPollOptions;
    return (
      <Stack data-testid="survey" styles={fullScreenStyles}>
        <Stack styles={oneQuestionPollStyle(props.theme)} tokens={{ childrenGap: '1rem' }}>
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
          {summarizationStatus && transcriptionFeatureEnabled && serverCallId && (
            <CallSummaryTile
              serverCallId={serverCallId}
              summarizationStatus={summarizationStatus}
              summary={transcriptionClientOptions?.summarization ? summary?.recap : undefined}
            />
          )}
        </Stack>
      </Stack>
    );
  }
  return <></>;
};
