// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallWithChatComposite,
  CallWithChatAdapter,
  COMPOSITE_LOCALE_EN_US,
  createStatefulCallClient,
  createAzureCommunicationCallWithChatAdapterFromClients,
  createStatefulChatClient
} from '@azure/communication-react';
import { Theme, PartialTheme, Spinner } from '@fluentui/react';
import MobileDetect from 'mobile-detect';
import React from 'react';
import { getApplicationName, getApplicationVersion } from '../utils/GetAppInfo';
import { getChatThreadIdFromTeamsLink } from '../utils/GetTeamsMeetingLink';
import { fullSizeStyles } from '../styles/Common.styles';
import { meetingExperienceLogoStyles } from '../styles/MeetingExperience.styles';

export type MeetingExperienceProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  displayName: string;
  endpointUrl: string;
  locator: TeamsMeetingLinkLocator;
  fluentTheme?: PartialTheme | Theme;
  waitingTitle: string;
  waitingSubtitle: string;
  logoUrl: string;
  chatEnabled: boolean;
};

export type MeetingExperienceState = {
  credential: AzureCommunicationTokenCredential;
  callWithChatAdapter: CallWithChatAdapter | undefined;
};

export class MeetingExperience extends React.Component<MeetingExperienceProps, MeetingExperienceState> {
  public constructor(props: MeetingExperienceProps) {
    super(props);

    this.state = {
      credential: new AzureCommunicationTokenCredential(props.token),
      callWithChatAdapter: undefined
    };
  }

  private async createAdapters(): Promise<void> {
    try {
      const adapter = await this.createCustomAdapter(
        { communicationUserId: this.props.userId.communicationUserId },
        this.state.credential,
        this.props.displayName,
        this.props.locator,
        this.props.endpointUrl
      );

      this.setState({ callWithChatAdapter: adapter });
    } catch (err) {
      // todo: error logging
      console.log(err);
    }
  }

  private async createCustomAdapter(userId, credential, displayName, locator, endpoint): Promise<CallWithChatAdapter> {
    const appName = getApplicationName();
    const appVersion = getApplicationVersion();
    const callClient = createStatefulCallClient(
      { userId },
      {
        callClientOptions: {
          diagnostics: {
            appName,
            appVersion
          }
        }
      }
    );

    const chatClient = createStatefulChatClient({
      userId,
      displayName,
      endpoint,
      credential
    });

    const callAgent = await callClient.createCallAgent(credential, { displayName });
    const chatThreadClient = await chatClient.getChatThreadClient(getChatThreadIdFromTeamsLink(locator.meetingLink));

    await chatClient.startRealtimeNotifications();

    return createAzureCommunicationCallWithChatAdapterFromClients({
      callClient,
      callAgent,
      callLocator: locator,
      chatClient,
      chatThreadClient
    });
  }

  componentDidMount(): void {
    this.createAdapters();
  }

  render(): JSX.Element {
    if (this.state.callWithChatAdapter) {
      const logo = this.props.logoUrl ? <img style={meetingExperienceLogoStyles} src={this.props.logoUrl} /> : <></>;
      const locale = COMPOSITE_LOCALE_EN_US;
      const formFactorValue = new MobileDetect(window.navigator.userAgent).mobile() ? 'mobile' : 'desktop';

      return (
        <CallWithChatComposite
          adapter={this.state.callWithChatAdapter}
          fluentTheme={this.props.fluentTheme}
          options={{
            callControls: {
              chatButton: this.props.chatEnabled
            }
          }}
          locale={{
            component: locale.component,
            strings: {
              chat: locale.strings.chat,
              call: {
                ...locale.strings.call,
                lobbyScreenWaitingToBeAdmittedTitle: this.props.waitingTitle,
                lobbyScreenWaitingToBeAdmittedMoreDetails: this.props.waitingSubtitle
              },
              callWithChat: locale.strings.callWithChat
            }
          }}
          icons={{
            LobbyScreenWaitingToBeAdmitted: logo,
            LobbyScreenConnectingToCall: logo
          }}
          formFactor={formFactorValue}
        />
      );
    }

    if (this.state.credential === undefined) {
      return <>Failed to construct credential. Provided token is malformed.</>;
    }

    return <Spinner styles={fullSizeStyles} />;
  }
}
