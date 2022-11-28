// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { RoomCallLocator } from '@azure/communication-calling';
import { CallAdapter, CallComposite } from '@azure/communication-react';
import { getApplicationName, getApplicationVersion } from '../../utils/GetAppInfo';
import { useEffect, useState, useMemo } from 'react';
import { createStatefulCallClient, createAzureCommunicationCallAdapterFromClient } from '@azure/communication-react';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { Spinner } from '@fluentui/react';
import { fullSizeStyles } from '../../styles/Common.styles';
import { RoomParticipantRole } from '../../models/RoomModel';

export interface RoomsMeetingExperienceProps {
  userId: string;
  userRole: RoomParticipantRole;
  token: string;
  inviteParticipantUrl?: string;
  locator: RoomCallLocator;
  onDisplayError(error: any): void;
}

export const RoomsMeetingExperience = (props: RoomsMeetingExperienceProps): JSX.Element => {
  const { userId, userRole, token, locator, onDisplayError } = props;

  const displayName =
    userRole === RoomParticipantRole.presenter ? 'Virtual appointments Host' : 'Virtual appointments User';

  const [callAdapter, setCallAdapter] = useState<CallAdapter | undefined>(undefined);

  const credential = useMemo(() => new AzureCommunicationTokenCredential(token), [token]);

  useEffect(() => {
    const _createAdapters = async (): Promise<void> => {
      try {
        const adapter = await _createCustomAdapter({ communicationUserId: userId }, credential, displayName, locator);

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
    if (userRole === RoomParticipantRole.presenter) {
      return <CallComposite adapter={callAdapter} callInvitationUrl={props.inviteParticipantUrl} />;
    } else if (userRole === RoomParticipantRole.attendee) {
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
