// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { RoomParticipant, RoomParticipantRole } from '../models/RoomModel';
import { fetchRoom } from './FetchRoomsResponse';

export async function createRoom(userRole: string): Promise<string> {
  const roomResponse = await fetchRoom();
  const roomId = roomResponse.roomId;
  const userId = roomResponse.participants.find(
    (participant: RoomParticipant) => (participant.role as RoomParticipantRole) === userRole
  )?.id;
  const redirectUrl = `/visit?roomId=${roomId}&userId=${userId}`;
  return redirectUrl;
}
