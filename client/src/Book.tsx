// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { LayerHost, Spinner, Stack, ThemeProvider, Text } from '@fluentui/react';
import { backgroundStyles, fullSizeStyles } from './styles/Common.styles';
import { embededIframeStyles } from './styles/Book.styles';
import { Header } from './Header';
import './styles/Common.css';
import { fetchConfig } from './utils/FetchConfig';
import { AppConfigModel } from './models/ConfigModel';
import { GenericError } from './components/GenericError';
import { useEffect, useState } from 'react';
import { FrequentlyAskedQuestions } from './components/FrequentlyAskedQuestions';
import {
  containerStyles,
  fullScreenStyles,
  innerContainer,
  lineHeight22px,
  lineHeight28px
} from './styles/FrequentlyAskedQuestions.styles';
import { BOOKINGS_SPECIMEN_URL } from './utils/Constants';
import WarningBanner from './components/Book/WarningBanner';

const PARENT_ID = 'BookMeetingSection';

export const Book = (): JSX.Element => {
  const [config, setConfig] = useState<AppConfigModel | undefined>(undefined);
  const [error, setError] = useState<any | undefined>(undefined);

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
    return (
      <ThemeProvider theme={config.theme} style={{ height: '100%' }}>
        <Stack styles={backgroundStyles(config.theme)}>
          <Header companyName={config.companyName} parentid={PARENT_ID} />
          {config.microsoftBookingsUrl ? (
            <LayerHost
              id={PARENT_ID}
              style={{
                position: 'relative',
                height: '100%'
              }}
            >
              {config.microsoftBookingsUrl === BOOKINGS_SPECIMEN_URL ? <WarningBanner /> : <></>}
              <iframe src={config.microsoftBookingsUrl} scrolling="yes" style={embededIframeStyles}></iframe>
            </LayerHost>
          ) : (
            <Stack styles={fullScreenStyles}>
              <Stack horizontalAlign="center" styles={containerStyles(config.theme)} tokens={{ childrenGap: 15 }}>
                <Stack styles={innerContainer}>
                  <Text styles={lineHeight28px}>No scheduling configured</Text>
                  <Text styles={lineHeight22px}>This sample does not have a Microsoft Bookings page configured.</Text>
                  <FrequentlyAskedQuestions></FrequentlyAskedQuestions>
                </Stack>
              </Stack>
            </Stack>
          )}
        </Stack>
      </ThemeProvider>
    );
  }

  if (error) {
    return <GenericError statusCode={error.statusCode} />;
  }

  return <Spinner styles={fullSizeStyles} />;
};
