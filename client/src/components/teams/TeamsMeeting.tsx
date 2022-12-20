// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationUserToken } from '@azure/communication-identity';
import { useEffect, useState } from 'react';
import { fetchToken } from '../../utils/FetchToken';
import { Spinner } from '@fluentui/react';
import { AppConfigModel } from '../../models/ConfigModel';
import { fullSizeStyles } from '../../styles/Common.styles';
import { TeamsMeetingExperience } from './TeamsMeetingExperience';
import { TeamsMeetingLinkLocator } from '@azure/communication-calling';

export interface TeamsMeetingProps {
  config: AppConfigModel;
  locator: TeamsMeetingLinkLocator;
  onDisplayError(error: any): void;
}

export const TeamsMeeting = (props: TeamsMeetingProps): JSX.Element => {
  const { config, locator, onDisplayError } = props;
  const [token, setToken] = useState<CommunicationUserToken | undefined>(undefined);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const token = await fetchToken();
        setToken(token);
      } catch (error) {
        console.error(error);
        onDisplayError(error);
      }
    };
    fetchData();
  }, []);

  if (!token) {
    // token not ready yet - show spinning/loading animation
    return <Spinner styles={fullSizeStyles} />;
  }

  return (
    <TeamsMeetingExperience
      userId={token.user}
      token={token.token}
      displayName="Virtual Appointments User"
      endpointUrl={config.communicationEndpoint}
      locator={locator}
      fluentTheme={config.theme}
      logoUrl={config.logoUrl}
      waitingTitle={config.waitingTitle}
      waitingSubtitle={config.waitingSubtitle}
      chatEnabled={config.chatEnabled}
      screenShareEnabled={config.screenShareEnabled}
      postCall={config.postCall}
      onDisplayError={(error) => onDisplayError(error)}
    />
  );
};
