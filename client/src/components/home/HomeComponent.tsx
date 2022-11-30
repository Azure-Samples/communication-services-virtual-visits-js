// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultButton, IContextualMenuProps, ImageFit, PartialTheme, StackItem, Theme } from '@fluentui/react';
import { Stack, Text, Image } from '@fluentui/react';
import imageCalendar from '../../assets/lightCalendarSymbol.png';
import {
  btnStackStyles,
  calendarIconStyles,
  containerMarginTop2rem,
  containerStyles,
  font16pxStyle,
  fullScreenStyles,
  innerContainer,
  lineHeight22px,
  lineHeight28px,
  linkIconStyles,
  videoIconStyles,
  buttonStyles
} from '../../styles/Home.styles';
import { FrequentlyAskedQuestions } from '../FrequentlyAskedQuestions';
import { LearnMoreItem } from '../LearnMoreItem';
import { fetchRoom } from '../../utils/FetchRoomsResponse';

export interface HomeProps {
  companyName: string;
  theme: PartialTheme | Theme;
}

export const clickhandler = (key: string) => {
  const roomResponse = fetchRoom();
  console.log(roomResponse);
};

export const menuProps: IContextualMenuProps = {
  items: [
    {
      key: 'host',
      text: 'as host (presenter)',
      onClick: () => {
        clickhandler('host');
      }
    },
    {
      key: 'attendee',
      text: 'as attendee'
    }
  ]
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
            <Image imageFit={ImageFit.contain} src={imageCalendar} alt="calendarImage"></Image>
          </Stack>
          <Stack styles={containerMarginTop2rem}>
            <Text styles={lineHeight28px}>Hello,</Text>
            <Text styles={lineHeight22px}>What would you like to do?</Text>
            <Stack horizontal styles={btnStackStyles} wrap horizontalAlign="space-evenly">
              <StackItem>
                <DefaultButton
                  text="Book an appointment"
                  styles={buttonStyles}
                  iconProps={calendarIconStyles(props.theme)}
                  onClick={() => window.location.replace('/book')}
                />
              </StackItem>
              <StackItem>
                <DefaultButton
                  text="Start a call"
                  splitButtonAriaLabel="See 2 options"
                  styles={buttonStyles}
                  iconProps={videoIconStyles(props.theme)}
                  aria-roledescription="split button"
                  menuProps={menuProps}
                />
              </StackItem>
              <StackItem>
                <DefaultButton
                  text="Join from link"
                  styles={buttonStyles}
                  iconProps={linkIconStyles(props.theme)}
                  onClick={() => window.location.replace('/visit')}
                />
              </StackItem>
            </Stack>
            <FrequentlyAskedQuestions />
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
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
