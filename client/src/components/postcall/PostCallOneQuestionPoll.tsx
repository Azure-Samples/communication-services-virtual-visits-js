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
  meetingLink: string;
}

export const PostCallOneQuestionPoll: React.FunctionComponent<PostCallOneQuestionPollProps> = (
  props: PostCallOneQuestionPollProps
) => {
  const [pollResponse, setPollResponse] = useState<boolean | string | number>();
  const [isSubmittingResponse, setIsSubmittingResponse] = useState<boolean>(false);

  const submitSurveyResponse = async (): Promise<void> => {
    const { acsUserId, callId, meetingLink } = props;
    setIsSubmittingResponse(true);
    try {
      await submitSurveyResponseUtil(acsUserId, pollResponse, meetingLink, callId);
      window.location.replace('/book');
    } catch (e) {
      setIsSubmittingResponse(false);
      //Add Error logging here;
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
        text={props.oneQuestionPollOptions.saveButtonText}
        onRenderIcon={isSubmittingResponse ? () => <Spinner size={SpinnerSize.xSmall} /> : undefined}
        disabled={isSubmittingResponse}
      />
    </Stack>
  );
};
