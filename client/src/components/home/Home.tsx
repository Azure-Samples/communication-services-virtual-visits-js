// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultButton, PartialTheme, StackItem, Theme } from '@fluentui/react';
import { Stack, Text, Image } from '@fluentui/react';
import imageCalendar from '../../assets/lightCalendarSymbol.png';
import {
  btnStackStyles,
  buttonStyle,
  containerStyles,
  font16pxStyle,
  fullScreenStyles,
  innerContainer,
  lineHeight22px,
  lineHeight28px
} from '../../styles/Home.styles';
import { FrequentlyAskedQuestions } from '../FrequentlyAskedQuestions';
import { LearnMoreItem } from '../LearnMoreItem';

export interface HomeProps {
  companyName: string;
  theme?: PartialTheme | Theme;
}

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
            <Stack horizontal horizontalAlign="space-evenly" styles={btnStackStyles}>
              <StackItem>
                <DefaultButton
                  text="Book an appointment"
                  styles={buttonStyle}
                  iconProps={{ iconName: 'Calendar' }}
                  onClick={() => window.location.replace('/book')}
                />
              </StackItem>
              <StackItem>
                <DefaultButton
                  text="Join from link"
                  styles={buttonStyle}
                  iconProps={{ iconName: 'Link' }}
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
                'This tutorial describes concepts for virtual appointment applications. After completing this tutorial and the associated Sample Builder, you will understand common use cases that a virtual appointment delivers'
              }
            />
            <LearnMoreItem
              headerText={'Azure Communication Services Rooms (Preview)'}
              headerLink={
                'https://learn.microsoft.com/samples/azure-samples/communication-services-dotnet-quickstarts/azure-communication-services---rooms-public-preview/'
              }
              description={
                'Azure Communication Services provides a concept of a room for developers who are building structured conversations such as virtual appointments or virtual events. Rooms currently allow voice and video delivers'
              }
            />
            <LearnMoreItem
              headerText={' Get Started with UI Library'}
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
