// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { RoomParticipantRole } from '../models/RoomModel';
import { ATTENDEE, PRESENTER, SURVEY } from './Constants';

export const submitSurveyResponseUtil = async (
  acsUserId: string,
  pollResponse: number | boolean | string | undefined,
  meetingLink: string,
  callId?: string
): Promise<void> => {
  try {
    const res = await fetch('/api/surveyResults', {
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      method: 'POST',
      body: JSON.stringify({
        callId: callId,
        acsUserId: acsUserId,
        meetingLink: meetingLink,
        response: pollResponse
      })
    });
    if (res.status !== 200) {
      console.log('Error during insertion');
      throw new Error('Error during insertion');
    }
  } catch (e) {
    //Add Error logging here;
  }
};

export const componentToShow = (renderPostCall: boolean, userRole: RoomParticipantRole): string => {
  if (!renderPostCall && userRole === RoomParticipantRole.presenter) return PRESENTER;
  else if (!renderPostCall && userRole === RoomParticipantRole.attendee) return ATTENDEE;
  else return SURVEY;
};
