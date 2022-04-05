// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CommunicationUserToken } from '@azure/communication-identity';
import { LayerHost, Spinner, Stack, ThemeProvider } from '@fluentui/react';
import { Header } from './Header';
import { MeetingExperience } from './components/MeetingExperience';
import { JoinTeamsMeeting } from './components/JoinTeamsMeeting';
import { AppConfigModel } from './models/ConfigModel';
import { TeamsMeetingLinkModel } from './models/TeamsMeetingLinkModel';
import { fetchConfig } from './utils/FetchConfig';
import { fetchToken } from './utils/FetchToken';
import { getTeamsMeetingLink } from './utils/GetTeamsMeetingLink';
import { backgroundStyles, fullSizeStyles } from './styles/Common.styles';
import './styles/Common.css';
import { GenericError } from './components/GenericError';

interface VisitState {
  config: AppConfigModel | undefined;
  token: CommunicationUserToken | undefined;
  error: any | undefined;
}

interface VisitProps {
  children?: React.ReactNode;
}

export class Visit extends React.Component<VisitProps, VisitState> {
  public constructor(props: VisitProps) {
    super(props);

    this.state = {
      config: undefined,
      token: undefined,
      error: undefined
    };
  }

  async componentDidMount(): Promise<void> {
    try {
      const config = await fetchConfig();
      const token = await fetchToken();
      this.setState({ config, token });
    } catch (error) {
      console.error(error);
      this.setState({ error });
    }
  }

  render(): JSX.Element {
    if (this.state.error) {
      return <GenericError statusCode={this.state.error.statusCode} />;
    } else {
      let meetingLinkModel: TeamsMeetingLinkModel | undefined;

      // try extracting Teams link from the url
      try {
        meetingLinkModel = getTeamsMeetingLink(window.location.search);
      } catch (error) {
        meetingLinkModel = undefined;
      }

      // if the state is loaded and we got a valid teams link - try to start
      // the meeting experience
      if (this.state.config && this.state.token && meetingLinkModel) {
        const locator = { meetingLink: meetingLinkModel.meetingUrl };
        const parentID = 'VisitSection';

        return (
          <ThemeProvider theme={this.state.config.theme} style={{ height: '100%' }}>
            <Stack styles={backgroundStyles(this.state.config.theme)}>
              <Header companyName={this.state.config.companyName} parentid={parentID} />
              <LayerHost
                id={parentID}
                style={{
                  position: 'relative',
                  height: '100%'
                }}
              >
                <MeetingExperience
                  userId={this.state.token.user}
                  token={this.state.token.token}
                  displayName="Virtual Visits User"
                  endpointUrl={this.state.config.communicationEndpoint}
                  locator={locator}
                  fluentTheme={this.state.config.theme}
                  logoUrl={this.state.config.logoUrl}
                  waitingTitle={this.state.config.waitingTitle}
                  waitingSubtitle={this.state.config.waitingSubtitle}
                  chatEnabled={this.state.config.chatEnabled}
                />
              </LayerHost>
            </Stack>
          </ThemeProvider>
        );
      } else if (this.state.config && !meetingLinkModel) {
        // If we have correct state but don't have a meeting link,
        // show a separate screen with "enter meeting link" textbox
        return (
          <ThemeProvider theme={this.state.config.theme} style={{ height: '100%' }}>
            <JoinTeamsMeeting config={this.state.config} />
          </ThemeProvider>
        );
      } else {
        // State not ready yet - show spinning/loading animation
        return <Spinner styles={fullSizeStyles} />;
      }
    }
  }
}
