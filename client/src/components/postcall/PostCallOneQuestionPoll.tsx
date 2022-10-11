// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { OneQuestionPollOptions } from '../../models/ConfigModel';
import { PartialTheme, PrimaryButton, Stack, Text, Theme } from '@fluentui/react';
import OneQuestionPollInput from './OneQuestionPollInput';
import { pollPromptStyle, pollTitleStyle, surveySubmitButtonStyles } from '../../styles/Survey.styles';
import { useState } from 'react';

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

  const submitSurveyResponse = async (): Promise<void> => {
    try {
      const res = await fetch('/api/surveyResults', {
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify({
          callId: props.callId,
          acsUserId: props.acsUserId,
          response: pollResponse
        })
      });
      if (res.status === 200) {
        window.location.replace('/book');
      } else {
        throw new Error('Error during insertion');
      }
    } catch (e) {
      console.error('Could not insert into DB');
    }
  };
  return (
    <Stack horizontalAlign="center" verticalAlign="center">
      <Text styles={pollTitleStyle}>{props.oneQuestionPollInfo.title}</Text>
      <Text styles={pollPromptStyle}>{props.oneQuestionPollInfo.prompt}</Text>
      <OneQuestionPollInput
        pollType={props.oneQuestionPollInfo.pollType}
        textInputPlaceholder={props.oneQuestionPollInfo.answerPlaceholder}
        setPollResponse={setPollResponse}
      />
      <PrimaryButton styles={surveySubmitButtonStyles} onClick={() => submitSurveyResponse()}>
        <Stack horizontal verticalAlign="center">
          <span>{props.oneQuestionPollInfo.saveButtonText}</span>
        </Stack>
      </PrimaryButton>
    </Stack>
  );
};
