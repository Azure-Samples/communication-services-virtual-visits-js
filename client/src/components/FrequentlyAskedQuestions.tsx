// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Link } from '@fluentui/react/lib/Link';
import { Stack, Text, StackItem, Icon } from '@fluentui/react';
import {
  btnStackStyles,
  font16pxStyle,
  linkStyles,
  newWindowIconWrapper,
  textDecorationNone
} from '../styles/FrequentlyAskedQuestions.styles';

export const FrequentlyAskedQuestions: React.VoidFunctionComponent = () => {
  return (
    <>
      <Text styles={font16pxStyle}>Frequently asked questions</Text>
      <Stack styles={btnStackStyles}>
        <Link
          tabIndex={0}
          data-testid="bookingsSetupLink"
          target="_blank"
          href="https://aka.ms/virtual-appointments-sample-bookings"
        >
          <Stack horizontal disableShrink>
            <StackItem align="center" style={linkStyles}>
              How do I change my Microsoft Bookings page URL?
            </StackItem>
            <StackItem align="center" style={textDecorationNone}>
              <span style={newWindowIconWrapper}>
                <Icon iconName="OpenInNewWindow" />
              </span>
            </StackItem>
          </Stack>
        </Link>
      </Stack>
    </>
  );
};
