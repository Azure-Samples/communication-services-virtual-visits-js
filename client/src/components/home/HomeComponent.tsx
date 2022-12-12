// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultButton, ImageFit, PartialTheme, Theme } from '@fluentui/react';
import { Stack, Text, Image } from '@fluentui/react';
import imageCalendar from '../../assets/lightCalendarSymbol.png';
import {
  btnStackStyles,
  containerMarginTop2rem,
  fullScreenStyles,
  innerContainer,
  lineHeight22px,
  lineHeight28px,
  buttonTextStyles,
  getButtonStyles
} from '../../styles/Home.styles';
import { FrequentlyAskedQuestions } from '../FrequentlyAskedQuestions';
import LearnMore from './LearnMore';
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
  const callCreateRoom = async (): Promise<void> => {
    try {
      const redirectUrl = await createRoomAndRedirectUrl();
      window.location.assign(redirectUrl);
    } catch (error) {
      setError(error);
    }
  };

  return (
    <Stack horizontal styles={btnStackStyles} wrap horizontalAlign="space-between">
      <HomeButton
        theme={theme}
        iconName={'Calendar'}
        text={'Book an appointment'}
        onClick={() => window.location.assign('/book')}
      />
      <HomeButton theme={theme} iconName={'Video'} text={'Start as Presenter'} onClick={callCreateRoom} />
      <HomeButton
        theme={theme}
        iconName={'Link'}
        text={'Join from link'}
        onClick={() => window.location.assign('/visit')}
      />
    </Stack>
  );
};

const HomeButton = ({ theme, iconName, text, onClick }): JSX.Element => {
  const buttonStyles = getButtonStyles(theme);
  return (
    <DefaultButton styles={buttonStyles} iconProps={{ iconName }} onClick={onClick}>
      <Text styles={buttonTextStyles}>{text}</Text>
    </DefaultButton>
  );
};

export default HomeComponent;
