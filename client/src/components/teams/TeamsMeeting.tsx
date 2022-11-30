// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationUserToken } from '@azure/communication-identity';
import { useEffect, useState } from 'react';
import { fetchToken } from '../../utils/FetchToken';
import { LayerHost, Spinner, Stack, ThemeProvider } from '@fluentui/react';
import { AppConfigModel } from '../../models/ConfigModel';
import { backgroundStyles, fullSizeStyles } from '../../styles/Common.styles';
import { Header } from '../../Header';
import { TeamsMeetingExperience } from './MeetingExperience';
import { TeamsMeetingLinkLocator } from '@azure/communication-calling';

const PARENT_ID = 'VisitSection';

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
    <ThemeProvider theme={config.theme} style={{ height: '100%' }}>
      <Stack styles={backgroundStyles(config.theme)}>
        <Header companyName={config.companyName} parentid={PARENT_ID} />
        <LayerHost
          id={PARENT_ID}
          style={{
            position: 'relative',
            height: '100%'
          }}
        >
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
            postCall={config.postCall}
            onDisplayError={(error) => onDisplayError(error)}
          />
        </LayerHost>
      </Stack>
    </ThemeProvider>
  );
};
