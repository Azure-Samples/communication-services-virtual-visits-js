// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { LayerHost, PrimaryButton, Spinner, Stack, ThemeProvider } from '@fluentui/react';
import { backgroundStyles, fullSizeStyles } from './styles/Common.styles';
import { embededIframeStyles } from './styles/Book.styles';
import { Header } from './Header';
import './styles/Common.css';
import { fetchConfig } from './utils/FetchConfig';
import { AppConfigModel } from './models/ConfigModel';
import { GenericError } from './components/GenericError';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { BOOKINGS_LINK_COOKIE } from './models/Cookies';

const PARENT_ID = 'BookMeetingSection';
const DUMMY_BOOKINGS_LINK = 'https://microsoftbookings.azurewebsites.net/?organization=healthcare&UICulture=en-US';

export const Book = (): JSX.Element => {
  const [cookies, setCookie, removeCookie] = useCookies([BOOKINGS_LINK_COOKIE]);
  const [config, setConfig] = useState<AppConfigModel | undefined>(undefined);
  const [error, setError] = useState<any | undefined>(undefined);

  console.log(cookies);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const fetchedConfig = await fetchConfig();
        setConfig(fetchedConfig);
      } catch (error) {
        console.error(error);
        setError(error);
      }
    };

    fetchData();
  }, []);

  if (config) {
    const bookingsLink =
      cookies.vvBookingsLink && cookies.vvBookingsLink.length > 0
        ? cookies.vvBookingsLink
        : config.microsoftBookingsUrl;
    console.log(bookingsLink);

    return (
      <ThemeProvider theme={config.theme} style={{ height: '100%' }}>
        <Stack styles={backgroundStyles(config.theme)}>
          <Header companyName={config.companyName} parentid={PARENT_ID} />
          <LayerHost
            id={PARENT_ID}
            style={{
              position: 'relative',
              height: '100%'
            }}
          >
            <Stack style={{ marginTop: '12px', width: '500px' }}>
              <PrimaryButton
                style={{ marginTop: '8px', marginBottom: '8px' }}
                onClick={() => setCookie(BOOKINGS_LINK_COOKIE, DUMMY_BOOKINGS_LINK)}
              >
                Set Bookings Link cookie
              </PrimaryButton>
              <PrimaryButton onClick={() => removeCookie(BOOKINGS_LINK_COOKIE)}>
                Unset Bookings Link cookie
              </PrimaryButton>
            </Stack>
            <iframe src={bookingsLink} scrolling="yes" style={embededIframeStyles}></iframe>
          </LayerHost>
        </Stack>
      </ThemeProvider>
    );
  }

  if (error) {
    return <GenericError statusCode={error.statusCode} />;
  }

  return <Spinner styles={fullSizeStyles} />;
};
