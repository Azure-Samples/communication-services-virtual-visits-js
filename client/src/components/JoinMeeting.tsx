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
  errorMessage?: string;
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
      let errorMessage;
      if (!isValidTeamsLink(newValue) && newValue !== '' && !isValidRoomsLink(newValue)) {
        errorMessage = 'This meeting link is invalid. Verify your meeting link URL.';
      }
      this.setState({ meetingLink: newValue, errorMessage });
    } else {
      this.setState({ meetingLink: '' });
    }
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
                  data-testid="meeting-link-textfield"
                  label="Join a call"
                  placeholder="Enter a meeting link"
                  styles={formStyles}
                  iconProps={{ iconName: 'Link' }}
                  onChange={this.onTeamsMeetingLinkChange.bind(this)}
                  errorMessage={this.state.errorMessage}
                  defaultValue={this.state.meetingLink}
                />
                <PrimaryButton
                  data-testid="join-call-button"
                  disabled={!enableButton}
                  styles={formStyles}
                  text={'Join call!'}
                  onClick={() => {
                    this.props.onJoinMeeting(link);
                  }}
                />
              </GenericContainer>
            </Stack>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}
