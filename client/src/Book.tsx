// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { LayerHost, Spinner, Stack, ThemeProvider, Link, Text } from '@fluentui/react';
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

  public iframeGenerator(conditionalElement: JSX.Element, iframeContentUrl: string) {
    const httpRequest = new XMLHttpRequest();
    const text =
      'The bookings page you are trying to reach is unavailable. The page may have been removed, deleted or the URL incorrectly entered';
    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          // success
          conditionalElement;
        } else {
          // failure. Act as you want
          <Text block={true}>
            {text}
            <Link tabIndex={0} data-testid="bookingsSetupLink" target="_blank" href={iframeContentUrl}>
              {'Learn More'}
            </Link>
          </Text>;
        }
      }
    };
    httpRequest.open('GET', iframeContentUrl);
    httpRequest.send();
  }

  render(): JSX.Element {
    const parentID = 'BookMeetingSection';
    if (this.state.config) {
      const conditionalElement = (
        <LayerHost id={parentID} style={{ position: 'relative', height: '100%' }}>
          <iframe src={this.state.config.microsoftBookingsUrl} scrolling="yes" style={embededIframeStyles}></iframe>
        </LayerHost>
      );
      return (
        <ThemeProvider theme={this.state.config.theme} style={{ height: '100%' }}>
          <Stack styles={backgroundStyles(this.state.config.theme)}>
            <Header companyName={this.state.config.companyName} parentid={parentID} />
            {this.iframeGenerator(conditionalElement, this.state.config.microsoftBookingsUrl)}
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
