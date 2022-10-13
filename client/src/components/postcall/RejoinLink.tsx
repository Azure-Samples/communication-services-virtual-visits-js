// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { Link } from '@fluentui/react';

export interface RejoinLinkProps {
  onRejoinCall: () => void;
}

export const RejoinLink: React.FunctionComponent<RejoinLinkProps> = (props: RejoinLinkProps) => {
  return <Link onClick={props.onRejoinCall}>{'or re-join the call'}</Link>;
};
