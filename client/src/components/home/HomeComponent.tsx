// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultButton, ImageFit, PartialTheme, Theme } from '@fluentui/react';
import { Stack, Text, Image } from '@fluentui/react';
import imageCalendar from '../../assets/lightCalendarSymbol.png';
import {
  btnStackStyles,
  containerMarginTop2rem,
  font16pxStyle,
  fullScreenStyles,
  innerContainer,
  lineHeight22px,
  lineHeight28px,
  buttonTextStyles,
  getButtonStyles
} from '../../styles/Home.styles';
import { FrequentlyAskedQuestions } from '../FrequentlyAskedQuestions';
import { LearnMoreItem } from '../LearnMoreItem';
import { createRoomAndRedirectUrl } from '../../utils/CreateRoom';

export interface HomeComponentProps {
  companyName: string;
  theme: PartialTheme | Theme;
  onDisplayError(error: any): void;
}

const HomeComponent = (props: HomeComponentProps): JSX.Element => {
  const { theme } = props;

  return (
    <Stack styles={fullScreenStyles}>
      <Stack horizontalAlign="center" verticalAlign="start" tokens={{ childrenGap: 15 }}>
        <Stack styles={innerContainer}>
          <Stack verticalAlign="center" horizontalAlign="center">
            <Image imageFit={ImageFit.contain} src={imageCalendar} alt="calendarImage"></Image>
          </Stack>
          <Stack styles={containerMarginTop2rem}>
            <Text styles={lineHeight28px}>Hello,</Text>
            <Text styles={lineHeight22px}>What would you like to do?</Text>
            <HomeButtons theme={theme} setError={props.onDisplayError} />
            <FrequentlyAskedQuestions />
            <LearnMore />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

const HomeButtons = ({ theme, setError }): JSX.Element => {
  const buttonStyles = getButtonStyles(theme);

  const callCreateRoom = async (): Promise<void> => {
    try {
      const redirectUrl = await createRoomAndRedirectUrl();
      window.location.assign(redirectUrl);
    } catch (error) {
      setError(error);
    }
  };

  const HomeButton = ({ iconName, text, onClick }): JSX.Element => {
    return (
      <DefaultButton styles={buttonStyles} iconProps={{ iconName }} onClick={onClick}>
        <Text styles={buttonTextStyles}>{text}</Text>
      </DefaultButton>
    );
  };

  return (
    <Stack horizontal styles={btnStackStyles} wrap horizontalAlign="space-between">
      <HomeButton iconName={'Calendar'} text={'Book an appointment'} onClick={() => window.location.assign('/book')} />
      <HomeButton iconName={'Video'} text={'Start as Presenter'} onClick={() => callCreateRoom()} />
      <HomeButton iconName={'Link'} text={'Join from link'} onClick={() => window.location.assign('/visit')} />
    </Stack>
  );
};

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

export default HomeComponent;
