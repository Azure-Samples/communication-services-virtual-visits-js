// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TeamsMeetingLinkLocator, RoomCallLocator } from '@azure/communication-calling';

const MEETING_URL_PARAMNAME = 'meetingURL';
const ROOM_URL_PARAMNAME = 'roomId';
const USER_ID_PARAMNAME = 'userId';
const JOIN_WEB_URL_PARAMNAME = 'JoinWebUrl';
const VISIT_HOSTNAME = 'visit.teams.microsoft.com';
const WEB_JOIN_PARAMNAME = 'webjoin';
const UNIFIED_PARAMNAME = 'unified';

export const getTeamsMeetingLink = (queryString: string): TeamsMeetingLinkLocator => {
  let meetingUrl = new URLSearchParams(queryString).get(MEETING_URL_PARAMNAME);
  if (!meetingUrl) throw 'Unable to get meetingURL from the url string';

  // Urls we get from Bookings are in the form https://visit.teams.microsoft.com?JoinWebUrl=<MEETING_LINK>.
  // The MEETING_LINK also has additional params appended to it which are not essential for joining the meeting. We have
  // to remove these, the unified and webjoin params, because including it causes the MeetingComposite to throw an error
  // about invalid link.
  if (meetingUrl.includes(VISIT_HOSTNAME)) {
    meetingUrl = new URLSearchParams(meetingUrl).get(JOIN_WEB_URL_PARAMNAME);
    if (!meetingUrl) throw 'Unable to get meetingURL from the alternative style url string';

    const url = new URL(meetingUrl);
    url.searchParams.delete(UNIFIED_PARAMNAME);
    url.searchParams.delete(WEB_JOIN_PARAMNAME);
    meetingUrl = url.toString();
  }

  return { meetingLink: meetingUrl };
};

export const getRoomCallLocator = (queryString: string): RoomCallLocator => {
  const roomId = new URLSearchParams(queryString).get(ROOM_URL_PARAMNAME);
  if (!roomId) throw 'Unable to get roomId from the url string';
  return { roomId: roomId };
};

export const getRoomsUserId = (queryString: string): string => {
  const userId = new URLSearchParams(queryString).get(USER_ID_PARAMNAME);
  if (!userId) throw 'Unable to get userId from the url string';
  return userId;
};

export const getCurrentMeetingURL = (queryString: string): string => {
  let meetingUrl = new URLSearchParams(queryString).get(MEETING_URL_PARAMNAME);
  if (!meetingUrl) {
    meetingUrl = '';
  }
  return meetingUrl;
};

export const getChatThreadIdFromTeamsLink = (teamsMeetingLink: string): string => {
  // Get the threadId from the url - this also contains the call locator ID that will be removed in the threadId.split
  let threadId = teamsMeetingLink.replace('https://teams.microsoft.com/l/meetup-join/', '');
  // Decode characters that outlook links encode
  threadId = threadId.replace(/%3a/g, ':').replace(/%40/g, '@');
  // Extract just the chat guid from the link, stripping away the call locator ID
  threadId = threadId.split(/^(.*?@thread\.(?:v2|skype))/gm)[1];

  if (!threadId || threadId.length === 0) {
    throw new Error('Could not get chat thread from teams link');
  }

  return threadId;
};

export const isValidTeamsLink = (teamsMeetingLink: string): boolean =>
  teamsMeetingLink.startsWith('https://teams.microsoft.com/l/meetup-join/');

export const isValidRoomsLink = (roomsMeetingLink: string): boolean => {
  try {
    const url = new URL(roomsMeetingLink);
    const roomId = url.searchParams.get(ROOM_URL_PARAMNAME);
    const userId = url.searchParams.get(USER_ID_PARAMNAME);

    const isValidLink: boolean = !!roomId && !!userId && roomsMeetingLink.startsWith(window.location.origin + '/visit');
    return isValidLink;
  } catch (e) {
    return false;
  }
};

export const makeTeamsJoinUrl = (teamsMeetingLink: string): string =>
  '?' + MEETING_URL_PARAMNAME + '=' + encodeURIComponent(teamsMeetingLink);

export const makeRoomsJoinUrl = (roomId: string, userId: string): string =>
  '/visit?roomId=' + roomId + '&userId=' + userId;
