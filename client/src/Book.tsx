// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { LayerHost, Spinner, Stack, ThemeProvider } from '@fluentui/react';
import {
  backgroundStyles,
  fullSizeStyles,
  getDefaultContainerStyles,
  getDefaultLayerHostStyles
} from './styles/Common.styles';
import { Header } from './Header';
import './styles/Common.css';
import { fetchConfig } from './utils/FetchConfig';
import { AppConfigModel } from './models/ConfigModel';
import { GenericError } from './components/GenericError';
import { useEffect, useState } from 'react';
import { BookingsPage } from './components/book/BookingsPage';
import { NoSchedulingPage } from './components/book/NoSchedulingPage';
import MobileDetect from 'mobile-detect';

export const Book = (): JSX.Element => {
  const [config, setConfig] = useState<AppConfigModel | undefined>(undefined);
  const [error, setError] = useState<any | undefined>(undefined);

  const PARENT_ID = 'BookMeetingSection';

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
    const containerStyles = getDefaultContainerStyles(
      config.theme,
      new MobileDetect(window.navigator.userAgent).mobile()
    );

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
              <BookingsPage config={config} />
            </LayerHost>
          ) : (
            <LayerHost id={PARENT_ID} style={getDefaultLayerHostStyles()}>
              <Stack styles={containerStyles} tokens={{ childrenGap: 15 }}>
                <NoSchedulingPage />
              </Stack>
            </LayerHost>
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
