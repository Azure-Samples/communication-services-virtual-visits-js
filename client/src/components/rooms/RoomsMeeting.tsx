// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { RoomCallLocator } from '@azure/communication-calling';
import { AppConfigModel } from '../../models/ConfigModel';
import { useEffect, useState } from 'react';
import { fetchRoomsResponse } from '../../utils/FetchRoomsResponse';
import { LayerHost, Spinner, Stack, ThemeProvider } from '@fluentui/react';
import { backgroundStyles, fullSizeStyles } from '../../styles/Common.styles';
import { RoomParticipantRole } from '../../models/RoomModel';
import { RoomsMeetingExperience } from './RoomsMeetingExperience';
import { Header } from '../../Header';

const PARENT_ID = 'VisitSection';

export interface RoomsMeetingProps {
  config: AppConfigModel;
  locator: RoomCallLocator;
  participantId: string;
  onDisplayError(error: any): void;
}

export const RoomsMeeting = (props: RoomsMeetingProps): JSX.Element => {
  const { config, locator, participantId, onDisplayError } = props;

  const [roomsToken, setRoomsToken] = useState<string | undefined>(undefined);
  const [userRole, setUserRole] = useState<RoomParticipantRole | undefined>(undefined);
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const roomsResponse = await fetchRoomsResponse(locator.roomId, participantId);
        setRoomsToken(roomsResponse.token);
        setUserRole(roomsResponse.participant.role);
      } catch (error) {
        console.error(error);
        onDisplayError(error);
      }
    };
    fetchData();
  }, []);

  if (!roomsToken || !userRole) {
    // token or userRole not ready yet - show spinning/loading animation
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
          <RoomsMeetingExperience
            roomsInfo={{
              userId: participantId,
              userRole: userRole,
              locator: locator
            }}
            token={roomsToken}
            onDisplayError={(error) => onDisplayError(error)}
          />
        </LayerHost>
      </Stack>
    </ThemeProvider>
  );
};
