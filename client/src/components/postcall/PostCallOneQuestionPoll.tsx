// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { OneQuestionPollOptions } from '../../models/ConfigModel';
import { PartialTheme, PrimaryButton, Stack, Text, Theme } from '@fluentui/react';
import OneQuestionPollInput from './OneQuestionPollInput';
import { pollPromptStyle, pollTitleStyle, surveySubmitButtonStyles } from '../../styles/Survey.styles';
import { useState } from 'react';
import { submitSurveyResponseUtil } from '../../utils/PostCallUtil';

export interface PostCallOneQuestionPollProps {
  oneQuestionPollOptions: OneQuestionPollOptions;
  theme?: PartialTheme | Theme;
  callId?: string;
  acsUserId: string;
}

export const PostCallOneQuestionPoll: React.FunctionComponent<PostCallOneQuestionPollProps> = (
  props: PostCallOneQuestionPollProps
) => {
  const [pollResponse, setPollResponse] = useState<boolean | string | number>();

  const submitSurveyResponse = async (): Promise<void> => {
    await submitSurveyResponseUtil(props.acsUserId, pollResponse, props.callId);
    window.location.replace('/book');
  };

  return (
    <Stack horizontalAlign="center" verticalAlign="center">
      <Text styles={pollTitleStyle}>{props.oneQuestionPollOptions.title}</Text>
      <Text styles={pollPromptStyle}>{props.oneQuestionPollOptions.prompt}</Text>
      <OneQuestionPollInput
        pollType={props.oneQuestionPollOptions.pollType}
        textInputPlaceholder={props.oneQuestionPollOptions.answerPlaceholder}
        setPollResponse={setPollResponse}
      />
      <PrimaryButton style={surveySubmitButtonStyles} onClick={() => submitSurveyResponse()}>
        <Stack horizontal verticalAlign="center">
          <span>{props.oneQuestionPollOptions.saveButtonText}</span>
        </Stack>
      </PrimaryButton>
    </Stack>
  );
};
