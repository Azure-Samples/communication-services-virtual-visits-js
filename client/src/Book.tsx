// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { LayerHost, Spinner, Stack, ThemeProvider } from '@fluentui/react';
import { backgroundStyles, fullSizeStyles } from './styles/Common.styles';
import { embededIframeStyles } from './styles/Book.styles';
import { Header } from './Header';
import './styles/Common.css';
import { fetchConfig } from './utils/FetchConfig';
import { AppConfigModel } from './models/ConfigModel';
import { GenericError } from './components/GenericError';

interface BookState {
  config: AppConfigModel | undefined;
  error: any | undefined;
}

interface BookProps {
  children?: React.ReactNode;
}

export class Book extends React.Component<BookProps, BookState> {
  public constructor(props: BookProps) {
    super(props);

    this.state = {
      config: undefined,
      error: undefined
    };
  }

  async componentDidMount(): Promise<void> {
    try {
      const config = await fetchConfig();
      this.setState({ config });
    } catch (error) {
      console.error(error);
      this.setState({ error });
    }
  }

  render(): JSX.Element {
    const parentID = 'BookMeetingSection';
    if (this.state.config) {
      return (
        <ThemeProvider theme={this.state.config.theme} style={{ height: '100%' }}>
          <Stack styles={backgroundStyles(this.state.config.theme)}>
            <Header companyName={this.state.config.companyName} parentid={parentID} />
            <LayerHost
              id={parentID}
              style={{
                position: 'relative',
                height: '100%',
                overflow: 'hidden'
              }}
            >
              <iframe src={this.state.config.microsoftBookingsUrl} scrolling="yes" style={embededIframeStyles}></iframe>
            </LayerHost>
          </Stack>
        </ThemeProvider>
      );
    } else if (this.state.error) {
      return <GenericError statusCode={this.state.error.statusCode} />;
    } else {
      return <Spinner styles={fullSizeStyles} />;
    }
  }
}
