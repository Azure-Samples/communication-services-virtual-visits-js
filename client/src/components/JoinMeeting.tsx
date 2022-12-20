// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { Stack, TextField, PrimaryButton, Theme, ThemeContext, createTheme } from '@fluentui/react';
import { Header } from '../Header';
import { AppConfigModel } from '../models/ConfigModel';
import { backgroundStyles } from '../styles/Common.styles';
import { formStyles } from '../styles/JoinMeeting.Styles';
import { getCurrentMeetingURL, isValidRoomsLink, isValidTeamsLink, makeTeamsJoinUrl } from '../utils/GetMeetingLink';
import GenericContainer from './GenericContainer';

interface JoinMeetingProps {
  config: AppConfigModel;
  onJoinMeeting(urlToJoin: string): void;
}

interface JoinMeetingState {
  meetingLink: string;
}

export class JoinMeeting extends React.Component<JoinMeetingProps, JoinMeetingState> {
  public constructor(props: JoinMeetingProps) {
    super(props);

    this.state = {
      meetingLink: getCurrentMeetingURL(window.location.search)
    };
  }

  private onTeamsMeetingLinkChange(
    _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ): void {
    if (newValue) {
      this.setState({ meetingLink: newValue });
    } else {
      this.setState({ meetingLink: '' });
    }
  }

  private onGetErrorMessage(value: string): string {
    if (isValidTeamsLink(value) || value === '' || isValidRoomsLink(value)) {
      return '';
    }

    return 'This meeting link is invalid. Verify your meeting link URL.';
  }

  render(): JSX.Element {
    const link = isValidTeamsLink(this.state.meetingLink)
      ? makeTeamsJoinUrl(this.state.meetingLink)
      : this.state.meetingLink;

    const enableButton = isValidTeamsLink(this.state.meetingLink) || isValidRoomsLink(this.state.meetingLink);
    const parentID = 'JoinTeamsMeetingSection';

    return (
      <ThemeContext.Consumer>
        {(theme: Theme | undefined) => {
          if (theme === undefined) {
            theme = createTheme();
          }
          return (
            <Stack styles={backgroundStyles(theme)}>
              <Header companyName={this.props.config.companyName} parentid={parentID} />
              <GenericContainer layerHostId={parentID} theme={theme}>
                <TextField
                  label="Join a call"
                  placeholder="Enter a meeting link"
                  styles={formStyles}
                  iconProps={{ iconName: 'Link' }}
                  onChange={this.onTeamsMeetingLinkChange.bind(this)}
                  onGetErrorMessage={this.onGetErrorMessage.bind(this)}
                  defaultValue={this.state.meetingLink}
                />
                <PrimaryButton
                  disabled={!enableButton}
                  styles={formStyles}
                  text={'Join call'}
                  onClick={() => this.props.onJoinMeeting(link)}
                />
              </GenericContainer>
            </Stack>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}
