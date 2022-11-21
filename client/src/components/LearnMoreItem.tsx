// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Link, Text } from '@fluentui/react';
import { font12pxSemiBoldStyle, font12pxWeight400Style } from '../styles/Home.styles';

export interface LearnMoreItemProps {
  headerText: string;
  headerLink: string;
  description: string;
}

export const LearnMoreItem: React.FunctionComponent<LearnMoreItemProps> = (props: LearnMoreItemProps) => {
  return (
    <>
      <Link styles={font12pxSemiBoldStyle} href={props.headerLink}>
        {props.headerText}
      </Link>
      <Text styles={font12pxWeight400Style}>{props.description}</Text>
    </>
  );
};
