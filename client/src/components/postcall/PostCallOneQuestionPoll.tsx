// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { OneQuestionPollOptions } from '../../models/ConfigModel';
import { PartialTheme, PrimaryButton, Spinner, SpinnerSize, Stack, Text, Theme } from '@fluentui/react';
import OneQuestionPollInput from './OneQuestionPollInput';
import { pollPromptStyle, pollTitleStyle, surveySubmitButtonStyles } from '../../styles/Survey.styles';
import { useState } from 'react';
import { submitSurveyResponseUtil } from '../../utils/PostCallUtil';

export interface PostCallOneQuestionPollProps {
  oneQuestionPollOptions: OneQuestionPollOptions;
  theme?: PartialTheme | Theme;
  callId?: string;
  acsUserId: string;
  onSurveyComplete?: () => void;
}

export const PostCallOneQuestionPoll: React.FunctionComponent<PostCallOneQuestionPollProps> = (
  props: PostCallOneQuestionPollProps
) => {
  const [pollResponse, setPollResponse] = useState<boolean | string | number>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submitSurveyResponse = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await submitSurveyResponseUtil(props.acsUserId, pollResponse, props.callId);
      // window.location.replace('/book');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      if (props.onSurveyComplete) {
        props.onSurveyComplete();
      }
    }
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
      <PrimaryButton
        style={surveySubmitButtonStyles}
        onClick={() => submitSurveyResponse()}
        onRenderIcon={
          isLoading ? () => <Spinner size={SpinnerSize.xSmall} styles={{ root: { paddingRight: '4px' } }} /> : undefined
        }
      >
        <Stack horizontal verticalAlign="center">
          <span>{props.oneQuestionPollOptions.saveButtonText}</span>
        </Stack>
      </PrimaryButton>
    </Stack>
  );
};
