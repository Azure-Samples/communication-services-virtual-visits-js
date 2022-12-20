// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallAdapter, CallAdapterState, CallComposite } from '@azure/communication-react';
import { getApplicationName, getApplicationVersion } from '../../utils/GetAppInfo';
import { useEffect, useState, useMemo } from 'react';
import { createStatefulCallClient, createAzureCommunicationCallAdapterFromClient } from '@azure/communication-react';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { Theme, PartialTheme, Stack, Spinner } from '@fluentui/react';
import { fullSizeStyles } from '../../styles/Common.styles';
import { RoomParticipantRole, RoomsInfo } from '../../models/RoomModel';
import { PostCallConfig } from '../../models/ConfigModel';
import { Survey } from '../postcall/Survey';
import MobileDetect from 'mobile-detect';
import InviteInstructions from './InviteInstructions';
import { isRoomsInviteInstructionsEnabled, isRoomsPostCallEnabled } from '../../utils/MeetingExperienceUtil';

export interface RoomsMeetingExperienceProps {
  roomsInfo: RoomsInfo;
  token: string;
  postCall?: PostCallConfig;
  fluentTheme?: PartialTheme | Theme;
  onDisplayError(error: any): void;
}

const RoomsMeetingExperience = (props: RoomsMeetingExperienceProps): JSX.Element => {
  const { roomsInfo, token, postCall, fluentTheme, onDisplayError } = props;
  const { userId, userRole, locator } = roomsInfo;

  const displayName =
    userRole === RoomParticipantRole.presenter ? 'Virtual appointments Host' : 'Virtual appointments User';

  const formFactorValue = new MobileDetect(window.navigator.userAgent).mobile() ? 'mobile' : 'desktop';

  const [callAdapter, setCallAdapter] = useState<CallAdapter | undefined>(undefined);
  const [renderPostCall, setRenderPostCall] = useState<boolean>(false);
  const [renderInviteInstructions, setRenderInviteInstructions] = useState<boolean>(false);
  const [callId, setCallId] = useState<string>();

  const credential = useMemo(() => new AzureCommunicationTokenCredential(token), [token]);

  useEffect(() => {
    const createAdapters = async (): Promise<void> => {
      try {
        const adapter = await _createCustomAdapter({ communicationUserId: userId }, credential, displayName, locator);

        const postCallEnabled = isRoomsPostCallEnabled(userRole, postCall);
        if (postCallEnabled) {
          adapter.on('callEnded', () => setRenderPostCall(true));
        }

        const toggleInviteInstructions = (state: CallAdapterState): void => {
          const roomsInviteInstructionsEnabled = isRoomsInviteInstructionsEnabled(
            userRole,
            formFactorValue,
            state?.page
          );
          setRenderInviteInstructions(roomsInviteInstructionsEnabled);
        };

        toggleInviteInstructions(adapter.getState());

        adapter.onStateChange((state) => {
          if (state.call?.id !== undefined && state.call?.id !== callId) {
            setCallId(adapter.getState().call?.id);
          }

          toggleInviteInstructions(state);
        });

        setCallAdapter(adapter);
      } catch (err) {
        // todo: error logging
        console.log(err);
        onDisplayError(err);
      }
    };

    createAdapters();
  }, [credential]);

  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }

  if (!callAdapter) {
    return <Spinner styles={fullSizeStyles} />;
  }

  if (renderPostCall && postCall && userRole !== RoomParticipantRole.presenter) {
    return (
      <Survey
        callId={callId}
        acsUserId={userId}
        meetingLink={locator.roomId}
        theme={fluentTheme}
        postCall={postCall}
        onRejoinCall={async () => {
          await callAdapter.joinCall();
          setRenderPostCall(false);
        }}
      />
    );
  }

  return (
    <Stack style={{ height: '100%' }}>
      <CallComposite
        adapter={callAdapter}
        fluentTheme={fluentTheme}
        formFactor={formFactorValue}
        callInvitationUrl={userRole === RoomParticipantRole.presenter ? roomsInfo.inviteParticipantUrl : undefined}
      />
      {renderInviteInstructions && <InviteInstructions fluentTheme={fluentTheme} />}
    </Stack>
  );
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

export default RoomsMeetingExperience;
