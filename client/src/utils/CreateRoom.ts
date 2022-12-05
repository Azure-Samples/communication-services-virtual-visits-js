// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { RoomParticipant, RoomParticipantRole } from '../models/RoomModel';
import { createRoom } from './FetchRoomsResponse';

export const createRoomAndRedirectUrl = async (userRole: string): Promise<string> => {
  let redirectUrl: string;
  try {
    const roomResponse = await createRoom();
    const roomId = roomResponse.roomId;
    const userId = roomResponse.participants.find(
      (participant: RoomParticipant) => (participant.role as RoomParticipantRole) === userRole
    )?.id;
    redirectUrl = `/visit?roomId=${roomId}&userId=${userId}`;
  } catch (e) {
    //EndUser to add logging errors in place of console logging below
    console.log(e);
    throw e; //Error will bubble up to Home.tsx
  }
  return redirectUrl;
};
