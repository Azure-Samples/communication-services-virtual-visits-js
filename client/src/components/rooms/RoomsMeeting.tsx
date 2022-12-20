// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { RoomCallLocator } from '@azure/communication-calling';
import { useEffect, useState } from 'react';
import { fetchRoomsResponse } from '../../utils/FetchRoomsResponse';
import { Spinner, PartialTheme, Theme } from '@fluentui/react';
import { fullSizeStyles } from '../../styles/Common.styles';
import { RoomParticipantRole } from '../../models/RoomModel';
import RoomsMeetingExperience from './RoomsMeetingExperience';
import { AppConfigModel } from '../../models/ConfigModel';
import { makeRoomsJoinUrl } from '../../utils/GetMeetingLink';

export interface RoomsMeetingProps {
  config: AppConfigModel;
  locator: RoomCallLocator;
  participantId: string;
  fluentTheme?: PartialTheme | Theme;
  onDisplayError(error: any): void;
}

export const RoomsMeeting = (props: RoomsMeetingProps): JSX.Element => {
  const { config, locator, participantId, fluentTheme, onDisplayError } = props;

  const [roomsToken, setRoomsToken] = useState<string | undefined>(undefined);
  const [userRole, setUserRole] = useState<RoomParticipantRole | undefined>(undefined);
  const [inviteUrl, setInviteUrl] = useState<string | undefined>(undefined);

  const formInviteUrl = (participantId: string): string => {
    return window.location.origin + makeRoomsJoinUrl(locator.roomId, participantId);
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const roomsResponse = await fetchRoomsResponse(locator.roomId, participantId);
        if (roomsResponse) {
          setRoomsToken(roomsResponse.token);
          setUserRole(roomsResponse.participant.role);
          if (roomsResponse.invitee) setInviteUrl(formInviteUrl(roomsResponse.invitee.id));
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
      roomsInfo={{
        userId: participantId,
        userRole: userRole,
        locator: locator,
        inviteParticipantUrl: inviteUrl
      }}
      token={roomsToken}
      fluentTheme={fluentTheme}
      postCall={config.postCall}
      onDisplayError={(error) => onDisplayError(error)}
    />
  );
};
