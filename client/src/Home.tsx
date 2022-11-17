// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { LayerHost, Spinner, Stack, ThemeProvider } from '@fluentui/react';
import { backgroundStyles, fullSizeStyles } from './styles/Common.styles';
// import { Header } from './Header';
import { useEffect, useState } from 'react';
import { fetchConfig } from './utils/FetchConfig';
import { GenericError } from './components/GenericError';
import { AppConfigModel } from './models/ConfigModel';
import { HomeComponent } from './components/home/Home';
import { Header } from './Header';
import './styles/Common.css';

const PARENT_ID = 'HomeSection';

export const Home = (): JSX.Element => {
  const [config, setConfig] = useState<AppConfigModel | undefined>(undefined);
  const [error, setError] = useState<any | undefined>(undefined);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const config = await fetchConfig();
        setConfig(config);
      } catch (error) {
        console.error(error);
        setError(error);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <GenericError statusCode={error.statusCode} />;
  }

  if (!config) {
    // config and token not ready yet - show spinning/loading animation
    return <Spinner styles={fullSizeStyles} />;
  }

  return (
    <ThemeProvider style={{ height: '100%' }}>
      <Stack styles={backgroundStyles(config.theme)}>
        <Header companyName={config.companyName} parentid={PARENT_ID} />
        <LayerHost
          id={PARENT_ID}
          style={{
            position: 'relative',
            height: '100%',
            width: '100%'
          }}
        >
          <HomeComponent companyName={config.companyName} theme={config.theme} />
        </LayerHost>
      </Stack>
    </ThemeProvider>
  );
};
