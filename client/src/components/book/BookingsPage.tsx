// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { BOOKINGS_SPECIMEN_URL } from '../../utils/Constants';
import WarningBanner from './WarningBanner';
import { AppConfigModel } from '../../models/ConfigModel';
import { embededIframeStyles } from '../../styles/Book.styles';

interface BookingsPageProps {
  config: AppConfigModel;
}

export const BookingsPage = (props: BookingsPageProps): JSX.Element => {
  return (
    <>
      {props.config.microsoftBookingsUrl === BOOKINGS_SPECIMEN_URL ? <WarningBanner /> : <></>}
      <iframe src={props.config.microsoftBookingsUrl} scrolling="yes" style={embededIframeStyles}></iframe>
    </>
  );
};
