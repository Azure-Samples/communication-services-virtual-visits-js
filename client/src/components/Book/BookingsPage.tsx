// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { LayerHost } from '@fluentui/react';
import { BOOKINGS_SPECIMEN_URL } from '../../utils/Constants';
import WarningBanner from './WarningBanner';
import { AppConfigModel } from '../../models/ConfigModel';
import { embededIframeStyles } from '../../styles/Book.styles';

const PARENT_ID = 'BookMeetingSection';

interface BookingsPageProps {
  config: AppConfigModel;
}

export const BookingsPage = (props: BookingsPageProps): JSX.Element => {
  return (
    <LayerHost
      id={PARENT_ID}
      style={{
        position: 'relative',
        height: '100%'
      }}
    >
      {props.config.microsoftBookingsUrl === BOOKINGS_SPECIMEN_URL ? <WarningBanner /> : <></>}
      <iframe src={props.config.microsoftBookingsUrl} scrolling="yes" style={embededIframeStyles}></iframe>
    </LayerHost>
  );
};
