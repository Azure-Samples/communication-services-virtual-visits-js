// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { RoomCallLocator } from '@azure/communication-calling';
import { useEffect, useState } from 'react';
import { fetchRoomsResponse } from '../../utils/FetchRoomsResponse';
import { PartialTheme, Spinner, Theme } from '@fluentui/react';
import { fullSizeStyles } from '../../styles/Common.styles';
import { RoomParticipantRole } from '../../models/RoomModel';
import { RoomsMeetingExperience } from './RoomsMeetingExperience';
import { PostCallConfig } from '../../models/ConfigModel';

export interface RoomsMeetingProps {
  theme: PartialTheme | Theme;
  postCall?: PostCallConfig;
  locator: RoomCallLocator;
  participantId: string;
  onDisplayError(error: any): void;
}

export const RoomsMeeting = (props: RoomsMeetingProps): JSX.Element => {
  const { theme, postCall, locator, participantId, onDisplayError } = props;

  const [roomsToken, setRoomsToken] = useState<string | undefined>(undefined);
  const [userRole, setUserRole] = useState<RoomParticipantRole | undefined>(undefined);
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const roomsResponse = await fetchRoomsResponse(locator.roomId, participantId);
        if (roomsResponse) {
          setRoomsToken(roomsResponse.token);
          setUserRole(roomsResponse.participant.role);
        }
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
    <RoomsMeetingExperience
      theme={theme}
      roomsInfo={{
        userId: participantId,
        userRole: userRole,
        locator: locator
      }}
      token={roomsToken}
      onDisplayError={(error) => onDisplayError(error)}
      postCall={postCall}
    />
  );
};
