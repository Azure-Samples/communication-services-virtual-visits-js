// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallWithChatComposite,
  CallWithChatAdapter,
  COMPOSITE_LOCALE_EN_US,
  // createStatefulCallClient,
  // createAzureCommunicationCallWithChatAdapterFromClients,
  // createStatefulChatClient,
  CallAdapter,
  useAzureCommunicationCallWithChatAdapter
} from '@azure/communication-react';
import { Theme, Spinner, PartialTheme } from '@fluentui/react';
import MobileDetect from 'mobile-detect';
import { useCallback, useEffect, useMemo, useState } from 'react';
// import { getApplicationName, getApplicationVersion } from '../../utils/GetAppInfo';
// import { getChatThreadIdFromTeamsLink } from '../../utils/GetMeetingLink';
import { fullSizeStyles } from '../../styles/Common.styles';
import { callWithChatComponentStyles, meetingExperienceLogoStyles } from '../../styles/MeetingExperience.styles';
// import { createStubChatClient } from '../../utils/stubs/chat';
import { Survey } from '../postcall/Survey';

import { PostCallConfig } from '../../models/ConfigModel';
export interface TeamsMeetingExperienceProps {
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
  screenShareEnabled: boolean;
  postCall: PostCallConfig | undefined;
  onDisplayError(error: any): void;
}

export const TeamsMeetingExperience = (props: TeamsMeetingExperienceProps): JSX.Element => {
  const {
    chatEnabled,
    screenShareEnabled,
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

  const [renderPostCall, setRenderPostCall] = useState<boolean>(false);
  const [callId, setCallId] = useState<string>();
  const credential = useMemo(() => new AzureCommunicationTokenCredential(token), [token]);

  const afterAdapterCreate = useCallback(async (adapter: CallAdapter): Promise<CallAdapter> => {
    adapter.on('callEnded', () => {
      setRenderPostCall(true);
    });
    adapter.onStateChange((state) => {
      if (state.call?.id !== undefined && state.call?.id !== callId) {
        setCallId(adapter.getState().call?.id);
      }
    });
    return adapter;
  }, []);

  let callWithChatAdapter;
  try {
    callWithChatAdapter = _createCustomAdapter(
      { communicationUserId: userId.communicationUserId },
      credential,
      displayName,
      locator,
      endpointUrl,
      chatEnabled,
      afterAdapterCreate
    );
  } catch (err) {
    // todo: error logging
    console.log(err);
    onDisplayError(err);
  }

  if (callWithChatAdapter) {
    const logo = logoUrl ? <img style={meetingExperienceLogoStyles} src={logoUrl} /> : <></>;
    const locale = COMPOSITE_LOCALE_EN_US;
    const formFactorValue = new MobileDetect(window.navigator.userAgent).mobile() ? 'mobile' : 'desktop';

    const acsUserId =
      callWithChatAdapter.getState().userId.kind === 'communicationUser'
        ? (callWithChatAdapter.getState().userId as CommunicationUserIdentifier).communicationUserId
        : '';

    return (
      <>
        {renderPostCall && postCall && (
          <Survey
            callId={callId}
            acsUserId={acsUserId}
            meetingLink={locator.meetingLink}
            theme={fluentTheme}
            postCall={postCall}
            onRejoinCall={async () => {
              await callWithChatAdapter.joinCall();
              setRenderPostCall(false);
            }}
          />
        )}
        <div
          data-testid="meeting-composite"
          style={callWithChatComponentStyles(renderPostCall && postCall ? true : false)}
        >
          <CallWithChatComposite
            adapter={callWithChatAdapter}
            fluentTheme={fluentTheme}
            options={{
              callControls: {
                chatButton: chatEnabled,
                screenShareButton: screenShareEnabled
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
        </div>
      </>
    );
  }
  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }

  return <Spinner styles={fullSizeStyles} />;
};

const _createCustomAdapter = (
  userId,
  credential,
  displayName,
  locator,
  endpoint,
  chatEnabled,
  afterAdapterCreate
): CallWithChatAdapter | undefined => {
  // const appName = getApplicationName();
  // const appVersion = getApplicationVersion();
  // const callClient = createStatefulCallClient(
  //   { userId },
  //   {
  //     callClientOptions: {
  //       diagnostics: {
  //         appName,
  //         appVersion
  //       }
  //     }
  //   }
  // );

  // const threadId = getChatThreadIdFromTeamsLink(locator.meetingLink);

  // const chatClient = chatEnabled
  //   ? createStatefulChatClient({
  //       userId,
  //       displayName,
  //       endpoint,
  //       credential
  //     })
  //   : createStubChatClient(userId, threadId);

  // await chatClient.startRealtimeNotifications();

  return useAzureCommunicationCallWithChatAdapter(
    {
      userId,
      displayName,
      endpoint,
      credential,
      locator
    },
    afterAdapterCreate
  );
};
