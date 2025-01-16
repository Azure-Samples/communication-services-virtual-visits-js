// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CallAdapter,
  CallAdapterState,
  CallComposite,
  useAzureCommunicationCallAdapter
} from '@azure/communication-react';
import { useState, useMemo, useCallback } from 'react';
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

  const [renderPostCall, setRenderPostCall] = useState<boolean>(false);
  const [renderInviteInstructions, setRenderInviteInstructions] = useState<boolean>(false);
  const [callId, setCallId] = useState<string>();

  const credential = useMemo(() => new AzureCommunicationTokenCredential(token), [token]);

  const afterAdapterCreate = useCallback(async (adapter: CallAdapter): Promise<CallAdapter> => {
    const postCallEnabled = isRoomsPostCallEnabled(userRole, postCall);
    if (postCallEnabled) {
      adapter.on('callEnded', () => setRenderPostCall(true));
    }
    adapter.onStateChange((state) => {
      if (state.call?.id !== undefined && state.call?.id !== callId) {
        setCallId(adapter.getState().call?.id);
      }
    });
    const toggleInviteInstructions = (state: CallAdapterState): void => {
      const roomsInviteInstructionsEnabled = isRoomsInviteInstructionsEnabled(userRole, formFactorValue, state?.page);
      setRenderInviteInstructions(roomsInviteInstructionsEnabled);
    };

    toggleInviteInstructions(adapter.getState());

    adapter.onStateChange((state) => {
      if (state.call?.id !== undefined && state.call?.id !== callId) {
        setCallId(adapter.getState().call?.id);
      }

      toggleInviteInstructions(state);
    });

    return adapter;
  }, []);

  const args = useMemo(
    () => ({
      userId: { communicationUserId: userId },
      displayName,
      credential,
      locator
    }),
    [userId, displayName, credential, locator]
  );

  let callAdapter;
  try {
    callAdapter = _createCustomAdapter(args, afterAdapterCreate);
  } catch (err) {
    // todo: error logging
    console.log(err);
    onDisplayError(err);
  }

  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }

  if (!callAdapter) {
    return <Spinner data-testid="spinner" styles={fullSizeStyles} />;
  }

  if (renderPostCall && postCall && userRole !== RoomParticipantRole.presenter) {
    return (
      <Survey
        data-testid="survey"
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
    <Stack data-testid="rooms-composite" style={{ height: '100%' }}>
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

const _createCustomAdapter = (args, afterAdapterCreate): CallAdapter | undefined => {
  return useAzureCommunicationCallAdapter(args, afterAdapterCreate);
};

export default RoomsMeetingExperience;
