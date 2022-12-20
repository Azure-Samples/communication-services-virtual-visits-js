// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  getInviteInstructionsMessageBarStyles,
  inviteInstructionsContainerStyles,
  inviteInstructionsTextStyles
} from '../../styles/RoomsMeetingExperience.styles';
import { ITheme, PartialTheme, Theme, Stack, MessageBar, Text } from '@fluentui/react';

interface InviteInstructionsProps {
  fluentTheme?: PartialTheme | Theme;
}

const InviteInstructions = (props: InviteInstructionsProps): JSX.Element => {
  const { fluentTheme } = props;
  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={inviteInstructionsContainerStyles}>
      <MessageBar styles={getInviteInstructionsMessageBarStyles(fluentTheme as ITheme)}>
        <InviteInstructionsText />
      </MessageBar>
    </Stack>
  );
};

// Extracting to a component since MessageBar does not render child components in tests
export const InviteInstructionsText = (): JSX.Element => {
  return (
    <Text styles={inviteInstructionsTextStyles}>
      {
        'Invite people to join the virtual appointment after starting the call by using "Copy invite link" under "People" > "Add People".'
      }
    </Text>
  );
};

export default InviteInstructions;
