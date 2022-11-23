// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon, Link, Stack, StackItem, Text } from '@fluentui/react';
import {
  linkStyles,
  font16pxStyle,
  btnStackStyles,
  newWindowIconWrapper,
  textDecorationNone
} from '../styles/Home.styles';

export const FrequentlyAskedQuestions: React.VoidFunctionComponent = () => {
  return (
    <>
      <Text styles={font16pxStyle}>Frequently asked questions</Text>
      <Stack styles={btnStackStyles}>
        <Link tabIndex={0} target="_blank" href="https://aka.ms/virtual-appointments-sample-bookings">
          <Stack horizontal>
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
