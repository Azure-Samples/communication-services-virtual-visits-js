// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultButton, Icon, IContextualMenuProps, Link, PartialTheme, StackItem, Theme } from '@fluentui/react';
import { Stack, Text, Image } from '@fluentui/react';
import imageCalendar from '../../assets/lightCalendarSymbol.png';
import {
  btnStackStyles,
  buttonStyle,
  containerStyles,
  font12pxSemiBoldStyle,
  font12pxWeight400Style,
  font16pxStyle,
  fullScreenStyles,
  innerContainer,
  lineHeight22px,
  lineHeight28px,
  linkStyles,
  newWindowIconWrapper,
  textDecorationNone
} from '../../styles/Home.styles';

export interface HomeProps {
  companyName: string;
  theme?: PartialTheme | Theme;
}

const menuProps: IContextualMenuProps = {
  items: [
    {
      key: 'host',
      text: 'as host (presenter)'
    },
    {
      key: 'attendee',
      text: 'as attendee'
    }
  ]
  // By default, the menu will be focused when it opens. Uncomment the next line to prevent this.
  // shouldFocusOnMount: false
};

export const HomeComponent = (props: HomeProps): JSX.Element => {
  return (
    <Stack styles={fullScreenStyles}>
      <Stack
        horizontalAlign="center"
        verticalAlign="start"
        styles={containerStyles(props.theme)}
        tokens={{ childrenGap: 15 }}
      >
        <Stack styles={innerContainer}>
          <Stack verticalAlign="center" horizontalAlign="center">
            <Image width="23.75rem" height="6.25rem" src={imageCalendar} alt="calendarImage"></Image>
          </Stack>
          <Stack>
            <Text styles={lineHeight28px}>Hello,</Text>
            <Text styles={lineHeight22px}>What would you like to do?</Text>
            <Stack horizontal horizontalAlign="space-between" styles={btnStackStyles}>
              <StackItem>
                <DefaultButton text="Book an appointment" styles={buttonStyle} iconProps={{ iconName: 'Calendar' }} />
              </StackItem>
              <StackItem>
                <DefaultButton
                  iconProps={{ iconName: 'Video' }}
                  text="Start a call"
                  split
                  splitButtonAriaLabel="See 2 options"
                  aria-roledescription="split button"
                  menuProps={menuProps}
                  styles={buttonStyle}
                />
              </StackItem>
              <StackItem>
                <DefaultButton text="Join from link" styles={buttonStyle} iconProps={{ iconName: 'Link' }} />
              </StackItem>
            </Stack>
            <Text styles={font16pxStyle}>Frequently asked questions</Text>
            <Stack styles={btnStackStyles}>
              <Link tabIndex={0} data-testid="bookingsSetupLink" target="_blank">
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
              <Link tabIndex={0} data-testid="bookingsSetupLink" target="_blank">
                <Stack horizontal disableShrink>
                  <StackItem align="center" style={linkStyles}>
                    How do I switch from using Rooms (preview) to using Microsoft Bookings?
                  </StackItem>
                  <StackItem align="center" style={textDecorationNone}>
                    <span style={newWindowIconWrapper}>
                      <Icon iconName="OpenInNewWindow" />
                    </span>
                  </StackItem>
                </Stack>
              </Link>
              <Link tabIndex={0} data-testid="bookingsSetupLink" target="_blank">
                <Stack horizontal disableShrink>
                  <StackItem align="center" style={linkStyles}>
                    More frequently asked questions
                  </StackItem>
                  <StackItem align="center" style={textDecorationNone}>
                    <span style={newWindowIconWrapper}>
                      <Icon iconName="OpenInNewWindow" />
                    </span>
                  </StackItem>
                </Stack>
              </Link>
            </Stack>
            <Text styles={font16pxStyle}>Learn more about Azure Communication Services</Text>
            <Link styles={font12pxSemiBoldStyle}>Azure Communication Services virtual appointments</Link>
            <Text styles={font12pxWeight400Style}>
              This tutorial describes concepts for virtual visit applications. After completing this tutorial and the
              associated Sample Builder, you will understand common use cases that a virtual appointments application
              delivers
            </Text>
            <Link styles={font12pxSemiBoldStyle}>Azure Communication Services Rooms (Preview)</Link>
            <Text styles={font12pxWeight400Style}>
              Azure Communication Services provides a concept of a room for developers who are building structured
              conversations such as virtual appointments or virtual events. Rooms currently allow voice and video
              delivers
            </Text>
            <Link styles={font12pxSemiBoldStyle}>Get Started with UI Library</Link>
            <Text styles={font12pxWeight400Style}>
              Get Started with Azure Communication Services UI Library to quickly integrate communication experiences
              into your applications. In this quickstart, learn how to integrate UI Library composites into an
              application and set up...
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
