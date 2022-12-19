// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { fullScreenStyles, innerContainer, lineHeight22px, lineHeight28px } from '../../styles/Book.styles';
import { Stack, Text } from '@fluentui/react';
import { FrequentlyAskedQuestions } from '../FrequentlyAskedQuestions';

export const NoSchedulingPage = (): JSX.Element => {
  return (
    <Stack styles={fullScreenStyles}>
      <Stack styles={innerContainer}>
        <Text styles={lineHeight28px}>No scheduling configured</Text>
        <Text styles={lineHeight22px}>This sample does not have a Microsoft Bookings page configured.</Text>
        <FrequentlyAskedQuestions />
      </Stack>
    </Stack>
  );
};
