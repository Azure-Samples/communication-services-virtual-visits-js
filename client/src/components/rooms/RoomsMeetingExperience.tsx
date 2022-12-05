// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallAdapter, CallComposite } from '@azure/communication-react';
import { getApplicationName, getApplicationVersion } from '../../utils/GetAppInfo';
import { useEffect, useState, useMemo } from 'react';
import { createStatefulCallClient, createAzureCommunicationCallAdapterFromClient } from '@azure/communication-react';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { PartialTheme, Spinner, Theme } from '@fluentui/react';
import { fullSizeStyles } from '../../styles/Common.styles';
import { RoomParticipantRole, RoomsInfo } from '../../models/RoomModel';
import { PostCallConfig } from '../../models/ConfigModel';
import { Survey } from '../postcall/Survey';

export interface RoomsMeetingExperienceProps {
  roomsInfo: RoomsInfo;
  token: string;
  theme: PartialTheme | Theme;
  inviteParticipantUrl?: string;
  postCall: PostCallConfig | undefined;
  onDisplayError(error: any): void;
}

export const RoomsMeetingExperience = (props: RoomsMeetingExperienceProps): JSX.Element => {
  const { roomsInfo, token, postCall, theme, inviteParticipantUrl, onDisplayError } = props;
  const { userId, userRole, locator } = roomsInfo;

  const displayName =
    userRole === RoomParticipantRole.presenter ? 'Virtual appointments Host' : 'Virtual appointments User';

  const [callAdapter, setCallAdapter] = useState<CallAdapter | undefined>(undefined);
  const [renderPostCall, setRenderPostCall] = useState<boolean>(false);
  const [callId, setCallId] = useState<string>();
  const credential = useMemo(() => new AzureCommunicationTokenCredential(token), [token]);

  useEffect(() => {
    const _createAdapters = async (): Promise<void> => {
      try {
        const adapter = await _createCustomAdapter({ communicationUserId: userId }, credential, displayName, locator);
        if (userRole === RoomParticipantRole.attendee && postCall?.survey.type) {
          adapter.on('callEnded', () => {
            setRenderPostCall(true);
          });
        }
        adapter.on('callIdChanged', () => {
          setCallId(adapter.getState().call?.id);
        });
        setCallAdapter(adapter);
      } catch (err) {
        // todo: error logging
        console.log(err);
        onDisplayError(err);
      }
    };

    _createAdapters();
  }, [credential, displayName, locator, userId, onDisplayError]);

  if (callAdapter) {
    //TODO set forFactor to mobile
    if (userRole === RoomParticipantRole.presenter) {
      return <CallComposite adapter={callAdapter} callInvitationUrl={inviteParticipantUrl} />;
    } else if (renderPostCall && postCall) {
      return (
        <Survey
          callId={callId}
          acsUserId={userId}
          meetingLink={locator.roomId}
          theme={theme}
          data-testid="Survey"
          postCall={postCall}
          onRejoinCall={async () => {
            await callAdapter.joinCall();
            setRenderPostCall(false);
          }}
        />
      );
    } else {
      return <CallComposite adapter={callAdapter} />;
    }
  }

  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }

  return <Spinner styles={fullSizeStyles} />;
};

const _createCustomAdapter = async (userId, credential, displayName, locator): Promise<CallAdapter> => {
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

  const callAgent = await callClient.createCallAgent(credential, { displayName });
  return createAzureCommunicationCallAdapterFromClient(callClient, callAgent, locator);
};
