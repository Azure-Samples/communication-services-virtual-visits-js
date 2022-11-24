// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon, Link, Stack, StackItem, Text } from '@fluentui/react';
import {
  font12pxSemiBoldStyle,
  font12pxWeight400Style,
  newWindowIconWrapper,
  textDecorationNone
} from '../styles/Home.styles';

export interface LearnMoreItemProps {
  headerText: string;
  headerLink: string;
  description: string;
}

export const LearnMoreItem: React.FunctionComponent<LearnMoreItemProps> = (props: LearnMoreItemProps) => {
  return (
    <>
      <Link target="_blank" href={props.headerLink}>
        <Stack horizontal>
          <StackItem align="center" style={font12pxSemiBoldStyle}>
            {props.headerText}
          </StackItem>
          <StackItem align="center" style={textDecorationNone}>
            <span style={newWindowIconWrapper}>
              <Icon iconName="OpenInNewWindow" />
            </span>
          </StackItem>
        </Stack>
      </Link>
      <Text styles={font12pxWeight400Style}>{props.description}</Text>
    </>
  );
};
