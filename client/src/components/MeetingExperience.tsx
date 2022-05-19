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
import { useEffect, useState } from 'react';
import { getApplicationName, getApplicationVersion } from '../utils/GetAppInfo';
import { getChatThreadIdFromTeamsLink } from '../utils/GetTeamsMeetingLink';
import { fullSizeStyles } from '../styles/Common.styles';
import { meetingExperienceLogoStyles } from '../styles/MeetingExperience.styles';

export interface MeetingExperienceProps {
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
  onDisplayError(error: any): void;
}

export const MeetingExperience = (props: MeetingExperienceProps): JSX.Element => {
  const {
    chatEnabled,
    displayName,
    endpointUrl,
    fluentTheme,
    locator,
    logoUrl,
    token,
    userId,
    waitingSubtitle,
    waitingTitle,
    onDisplayError
  } = props;

  const [callWithChatAdapter, setCallWithChatAdapter] = useState<CallWithChatAdapter | undefined>(undefined);

  useEffect(() => {
    const createAdapters = async (): Promise<void> => {
      try {
        const credential = _getCredential(token);

        const adapter = await _createCustomAdapter(
          { communicationUserId: userId.communicationUserId },
          credential,
          displayName,
          locator,
          endpointUrl,
          chatEnabled
        );

        setCallWithChatAdapter(adapter);
      } catch (err) {
        // todo: error logging
        console.log(err);
        onDisplayError(err);
      }
    };

    createAdapters();
  }, [displayName, endpointUrl, locator, token, userId, onDisplayError]);

  if (!callWithChatAdapter) {
    return <Spinner styles={fullSizeStyles} />;
  }

  const logo = logoUrl ? <img style={meetingExperienceLogoStyles} src={logoUrl} /> : <></>;
  const locale = COMPOSITE_LOCALE_EN_US;
  const formFactorValue = new MobileDetect(window.navigator.userAgent).mobile() ? 'mobile' : 'desktop';

  return (
    <CallWithChatComposite
      adapter={callWithChatAdapter}
      fluentTheme={fluentTheme}
      options={{
        callControls: {
          chatButton: chatEnabled
        }
      }}
      locale={{
        component: locale.component,
        strings: {
          chat: locale.strings.chat,
          call: {
            ...locale.strings.call,
            lobbyScreenWaitingToBeAdmittedTitle: waitingTitle,
            lobbyScreenWaitingToBeAdmittedMoreDetails: waitingSubtitle
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
};

const _getCredential = (token: string): AzureCommunicationTokenCredential => {
  return new AzureCommunicationTokenCredential(token);
};

const _createCustomAdapter = async (
  userId,
  credential,
  displayName,
  locator,
  endpoint,
  chatEnabled
): Promise<CallWithChatAdapter> => {
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
};
