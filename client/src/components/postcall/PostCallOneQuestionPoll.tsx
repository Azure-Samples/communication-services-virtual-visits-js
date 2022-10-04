// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { OneQuestionPollOptions } from '../../models/ConfigModel';
import { PartialTheme, PrimaryButton, Stack, Text, Theme } from '@fluentui/react';
import OneQuestionPollInput from './OneQuestionPollInput';
import { pollPromptStyle, pollTitleStyle } from '../../styles/Survey.styles';

interface PostCallOneQuestionPollProps {
  oneQuestionPollInfo: OneQuestionPollOptions;
  theme?: PartialTheme | Theme;
}

export const PostCallOneQuestionPoll: React.FunctionComponent<PostCallOneQuestionPollProps> = (
  props: PostCallOneQuestionPollProps
) => {
  return (
    <Stack horizontalAlign="center" verticalAlign="center">
      <Text styles={pollTitleStyle}>{props.oneQuestionPollInfo.title}</Text>
      <Text styles={pollPromptStyle}>{props.oneQuestionPollInfo.prompt}</Text>
      <OneQuestionPollInput
        pollType={props.oneQuestionPollInfo.pollType}
        textInputPlaceholder={props.oneQuestionPollInfo.answerPlaceholder}
      />
      <PrimaryButton tabIndex={-1} width="20rem" height="2.5rem">
        <Stack horizontal verticalAlign="center">
          <span>{props.oneQuestionPollInfo.saveButtonText}</span>
        </Stack>
      </PrimaryButton>
    </Stack>
  );
};
