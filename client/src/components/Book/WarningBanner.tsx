// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MessageBar, MessageBarType, Text, Link } from '@fluentui/react';
import { BOOKINGS_README_URL } from '../../utils/Constants';

const WarningBanner = (): JSX.Element => {
  return (
    <MessageBar messageBarType={MessageBarType.warning} isMultiline={false} dismissButtonAriaLabel="Close">
      <WarningMessage />
    </MessageBar>
  );
};

// Extracting to a component since MessageBar is not rendering child components in tests
export const WarningMessage = (): JSX.Element => {
  return (
    <>
      <Text>This Booking page is a specimen and will not create appointments or send reminders.</Text>
      <Link href={BOOKINGS_README_URL} target="_blank" underline>
        <Text>Check out the sample readme.</Text>
      </Link>
    </>
  );
};

export default WarningBanner;
