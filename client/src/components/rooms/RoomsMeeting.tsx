// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { RoomCallLocator } from '@azure/communication-calling';
import { useEffect, useState } from 'react';
import { fetchRoomsResponse } from '../../utils/FetchRoomsResponse';
import { Spinner } from '@fluentui/react';
import { fullSizeStyles } from '../../styles/Common.styles';
import { RoomParticipantRole } from '../../models/RoomModel';
import { RoomsMeetingExperience } from './RoomsMeetingExperience';
import { makeRoomsJoinUrl } from '../../utils/GetMeetingLink';

export interface RoomsMeetingProps {
  locator: RoomCallLocator;
  participantId: string;
  onDisplayError(error: any): void;
}

export const RoomsMeeting = (props: RoomsMeetingProps): JSX.Element => {
  const { locator, participantId, onDisplayError } = props;

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
      onDisplayError={(error) => onDisplayError(error)}
    />
  );
};
