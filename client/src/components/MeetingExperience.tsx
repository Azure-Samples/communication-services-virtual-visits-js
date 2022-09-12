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
  createStatefulChatClient,
  CallWithChatAdapterState
} from '@azure/communication-react';
import { Theme, Spinner, PartialTheme } from '@fluentui/react';
import MobileDetect from 'mobile-detect';
import { useEffect, useMemo, useState } from 'react';
import { getApplicationName, getApplicationVersion } from '../utils/GetAppInfo';
import { getChatThreadIdFromTeamsLink } from '../utils/GetTeamsMeetingLink';
import { fullSizeStyles } from '../styles/Common.styles';
import { meetingExperienceLogoStyles } from '../styles/MeetingExperience.styles';
import { createStubChatClient } from '../utils/stubs/chat';
import { Survey } from '../components/Survey';

import { PostCallConfig } from '../models/ConfigModel';
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
  postCall: PostCallConfig | undefined;
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
    postCall,
    onDisplayError
  } = props;

  const [callWithChatAdapter, setCallWithChatAdapter] = useState<CallWithChatAdapter | undefined>(undefined);
  const [renderPostCall, setRenderPostCall] = useState<boolean>(false);
  const credential = useMemo(() => new AzureCommunicationTokenCredential(token), [token]);

  useEffect(() => {
    const _createAdapters = async (): Promise<void> => {
      try {
        const adapter = await _createCustomAdapter(
          { communicationUserId: userId.communicationUserId },
          credential,
          displayName,
          locator,
          endpointUrl,
          chatEnabled
        );
        if (postCall?.survey.type) {
          adapter.on('callEnded', () => {
            setRenderPostCall(true);
          });
        }
        setCallWithChatAdapter(adapter);
      } catch (err) {
        // todo: error logging
        console.log(err);
        onDisplayError(err);
      }
    };

    _createAdapters();
  }, [credential, displayName, endpointUrl, locator, userId, onDisplayError]);
  if (callWithChatAdapter) {
    const logo = logoUrl ? <img style={meetingExperienceLogoStyles} src={logoUrl} /> : <></>;
    const locale = COMPOSITE_LOCALE_EN_US;
    const formFactorValue = new MobileDetect(window.navigator.userAgent).mobile() ? 'mobile' : 'desktop';

    if (renderPostCall && postCall) {
      return (
        <Survey
          postCall={postCall}
          onRejoinCall={() => {
            setRenderPostCall(false);
            callWithChatAdapter.onStateChange((state: CallWithChatAdapterState) => {
              //page is set to lobby to avoid flicker of Devices page when "rejoin call" is clicked
              if (state.page === 'configuration') state.page = 'lobby';
            });
            callWithChatAdapter.joinCall();
          }}
        />
      );
    }

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
  }
  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }

  return <Spinner styles={fullSizeStyles} />;
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

  const threadId = getChatThreadIdFromTeamsLink(locator.meetingLink);

  const chatClient = chatEnabled
    ? createStatefulChatClient({
        userId,
        displayName,
        endpoint,
        credential
      })
    : createStubChatClient(userId, threadId);

  const callAgent = await callClient.createCallAgent(credential, { displayName });
  const chatThreadClient = await chatClient.getChatThreadClient(threadId);

  await chatClient.startRealtimeNotifications();

  return createAzureCommunicationCallWithChatAdapterFromClients({
    callClient,
    callAgent,
    callLocator: locator,
    chatClient,
    chatThreadClient
  });
};
