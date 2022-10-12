// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { OneQuestionPollOptions } from '../../models/ConfigModel';
import { PartialTheme, PrimaryButton, Stack, Text, Theme } from '@fluentui/react';
import OneQuestionPollInput from './OneQuestionPollInput';
import { pollPromptStyle, pollTitleStyle, surveySubmitButtonStyles } from '../../styles/Survey.styles';
import { useState } from 'react';
import { submitSurveyResponse } from '../../utils/PostCallUtil';

export interface PostCallOneQuestionPollProps {
  oneQuestionPollInfo: OneQuestionPollOptions;
  theme?: PartialTheme | Theme;
  callId?: string;
  acsUserId: string;
}

export const PostCallOneQuestionPoll: React.FunctionComponent<PostCallOneQuestionPollProps> = (
  props: PostCallOneQuestionPollProps
) => {
  const [pollResponse, setPollResponse] = useState<boolean | string | number>();

  return (
    <Stack horizontalAlign="center" verticalAlign="center">
      <Text styles={pollTitleStyle}>{props.oneQuestionPollInfo.title}</Text>
      <Text styles={pollPromptStyle}>{props.oneQuestionPollInfo.prompt}</Text>
      <OneQuestionPollInput
        pollType={props.oneQuestionPollInfo.pollType}
        textInputPlaceholder={props.oneQuestionPollInfo.answerPlaceholder}
        setPollResponse={setPollResponse}
      />
      <PrimaryButton
        style={surveySubmitButtonStyles}
        onClick={() =>
          submitSurveyResponse(
            props.acsUserId,
            pollResponse !== undefined ? pollResponse : undefined,
            props.callId ? props.callId : undefined
          )
        }
      >
        <Stack horizontal verticalAlign="center">
          <span>{props.oneQuestionPollInfo.saveButtonText}</span>
        </Stack>
      </PrimaryButton>
    </Stack>
  );
};
