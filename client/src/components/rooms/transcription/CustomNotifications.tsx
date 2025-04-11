// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ActiveNotification, NotificationStack, usePropsFor } from '@azure/communication-react';
import { Stack } from '@fluentui/react';

export interface CustomNotificationsProps {
  customNotifications: ActiveNotification[];
}

export const CustomNotifications = (props: CustomNotificationsProps): JSX.Element => {
  const { customNotifications } = props;
  const notificationProps = usePropsFor(NotificationStack);

  return (
    <Stack style={{ position: 'absolute', paddingTop: '2rem', zIndex: 10 }}>
      <NotificationStack
        {...notificationProps}
        activeNotifications={notificationProps.activeNotifications.concat(customNotifications)}
        maxNotificationsToShow={3}
      />
    </Stack>
  );
};
