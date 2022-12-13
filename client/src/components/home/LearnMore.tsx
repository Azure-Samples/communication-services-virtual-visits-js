// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon, Link, Stack, StackItem, Text } from '@fluentui/react';
import {
  font12pxSemiBoldStyle,
  font12pxWeight400Style,
  font16pxStyle,
  newWindowIconWrapper,
  textDecorationNone
} from '../../styles/Home.styles';

const LearnMore = (): JSX.Element => {
  return (
    <>
      <Text styles={font16pxStyle}>Learn more about Azure Communication Services</Text>
      <LearnMoreItem
        headerText={'Azure Communication Services virtual appointments'}
        headerLink={'https://learn.microsoft.com/azure/communication-services/tutorials/virtual-visits'}
        description={
          'This tutorial describes concepts for virtual appointment applications. After completing this tutorial and the associated Sample Builder, you will understand common use cases that a virtual appointment delivers...'
        }
      />
      <LearnMoreItem
        headerText={'Azure Communication Services Rooms (Preview)'}
        headerLink={'https://learn.microsoft.com/en-us/azure/communication-services/concepts/rooms/room-concept'}
        description={
          'Azure Communication Services provides a concept of a room for developers who are building structured conversations such as virtual appointments or virtual events. Rooms currently allow voice and video calling...'
        }
      />
      <LearnMoreItem
        headerText={'Get Started with UI Library'}
        headerLink={
          'https://learn.microsoft.com/azure/communication-services/quickstarts/ui-library/get-started-composites?tabs=kotlin&pivots=platform-web'
        }
        description={
          'Get Started with Azure Communication Services UI Library to quickly integrate communication experiences into your applications. In this quickstart, learn how to integrate UI Library composites into an application and set up...'
        }
      />
    </>
  );
};

interface LearnMoreItemProps {
  headerText: string;
  headerLink: string;
  description: string;
}

const LearnMoreItem: React.FunctionComponent<LearnMoreItemProps> = (props: LearnMoreItemProps) => {
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

export default LearnMore;
