// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationUserToken } from '@azure/communication-identity';
import { LayerHost, Spinner, Stack, ThemeProvider } from '@fluentui/react';
import React from 'react';
import { Header } from './Header';
import { GenericError } from './components/GenericError';
import { MeetingExperience } from './components/MeetingExperience';
import { JoinTeamsMeeting } from './components/JoinTeamsMeeting';
import { AppConfigModel } from './models/ConfigModel';
import { TeamsMeetingLinkModel } from './models/TeamsMeetingLinkModel';
import './styles/Common.css';
import { backgroundStyles, fullSizeStyles } from './styles/Common.styles';
import { fetchConfig } from './utils/FetchConfig';
import { fetchToken } from './utils/FetchToken';
import { getTeamsMeetingLink } from './utils/GetTeamsMeetingLink';
// import { getCurrentMeetingURL, getTeamsMeetingLink, makeJoinUrl } from './utils/GetTeamsMeetingLink';

interface VisitState {
  config: AppConfigModel | undefined;
  token: CommunicationUserToken | undefined;
  error: any | undefined;
  meetingLinkModel: TeamsMeetingLinkModel | undefined;
}

interface VisitProps {
  children?: React.ReactNode;
}

export class Visit extends React.Component<VisitProps, VisitState> {
  private _getMeetingLinkModel(meetingLink: string): TeamsMeetingLinkModel | undefined {
    let meetingLinkModel: TeamsMeetingLinkModel | undefined = undefined;

    if (meetingLink) {
      // try extracting Teams link from the url
      try {
        meetingLinkModel = getTeamsMeetingLink(meetingLink);
      } catch (error) {
        meetingLinkModel = undefined;
      }
    }

    return meetingLinkModel;
  }

  private _onJoinMeeting(link: string): void {
    window.history.pushState({}, document.title, window.location.href + link);
    this.setState({ meetingLinkModel: this._getMeetingLinkModel(link) });
  }

  private _resetVisit(): void {
    window.location.assign(window.location.href);
  }

  public constructor(props: VisitProps) {
    super(props);

    this._onJoinMeeting.bind(this);

    window.onpopstate = () => this._resetVisit();

    this.state = {
      config: undefined,
      token: undefined,
      error: undefined,
      meetingLinkModel: this._getMeetingLinkModel(window.location.search) // case of direct link to visit with meeting link in URL
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
      // if the state is loaded and we got a valid teams link - try to start
      // the meeting experience
      if (this.state.config && this.state.token) {
        if (this.state.meetingLinkModel) {
          const locator = { meetingLink: this.state.meetingLinkModel.meetingUrl };
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
        } else {
          // If we have valid config and token but no meeting link,
          // show a separate screen with "enter meeting link" textbox
          return (
            <ThemeProvider theme={this.state.config.theme} style={{ height: '100%' }}>
              <JoinTeamsMeeting config={this.state.config} onJoinMeeting={(link) => this._onJoinMeeting(link)} />
            </ThemeProvider>
          );
        }
      } else {
        // State not ready yet - show spinning/loading animation
        return <Spinner styles={fullSizeStyles} />;
      }
    }
  }
}
