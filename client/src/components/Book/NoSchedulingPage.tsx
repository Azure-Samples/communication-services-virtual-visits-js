// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  containerStyles,
  fullScreenStyles,
  innerContainer,
  lineHeight22px,
  lineHeight28px
} from '../../styles/Book.styles';
import { Stack, Text } from '@fluentui/react';
import { FrequentlyAskedQuestions } from '../FrequentlyAskedQuestions';
import { AppConfigModel } from '../../models/ConfigModel';

interface NoSchedulingPageProps {
  config: AppConfigModel;
}

export const NoSchedulingPage = (props: NoSchedulingPageProps): JSX.Element => {
  return (
    <Stack styles={fullScreenStyles}>
      <Stack horizontalAlign="center" styles={containerStyles(props.config.theme)} tokens={{ childrenGap: 15 }}>
        <Stack styles={innerContainer}>
          <Text styles={lineHeight28px}>No scheduling configured</Text>
          <Text styles={lineHeight22px}>This sample does not have a Microsoft Bookings page configured.</Text>
          <FrequentlyAskedQuestions />
        </Stack>
      </Stack>
    </Stack>
  );
};
