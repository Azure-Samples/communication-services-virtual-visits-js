// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { RoomCallLocator } from '@azure/communication-calling';
import {
  getChatThreadIdFromTeamsLink,
  getCurrentMeetingURL,
  getRoomCallLocator,
  getRoomsUserId,
  getTeamsMeetingLink,
  makeRoomsJoinUrl,
  makeTeamsJoinUrl,
  isValidRoomsLink,
  isValidTeamsLink
} from './GetMeetingLink';

describe('getTeamsMeetingLink', () => {
  test('should correctly parse valid teams url', () => {
    const result = getTeamsMeetingLink(
      '?meetingURL=https%3A%2F%2Fteams.microsoft.com%2Fl%2Fmeetup-join%2F19%253ameeting_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2540thread.v2%2F0%3Fcontext%3D%257b%2522Tid%2522%253a%252200000000-0000-0000-0000-000000000000%2522%252c%2522Oid%2522%253a%252200000000-0000-0000-0000-000000000000%2522%257d'
    );

    expect(result.meetingLink).toBe(
      'https://teams.microsoft.com/l/meetup-join/19%3ameeting_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%40thread.v2/0?context=%7b%22Tid%22%3a%2200000000-0000-0000-0000-000000000000%22%2c%22Oid%22%3a%2200000000-0000-0000-0000-000000000000%22%7d'
    );
  });

  test('should throw exception when unable to parse teams url', () => {
    try {
      getTeamsMeetingLink('incorrecturl');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('should throw exception when unable to extract threadId from Teams link', () => {
    try {
      getTeamsMeetingLink(
        '?meetingURL=https%3A%2F%2Fteams.microsoft.com%2Fl%2Fmeetup-join%2F0%3Fcontext%3D%257b%2522Tid%2522%253a%252200000000-0000-0000-0000-000000000000%2522%252c%2522Oid%2522%253a%252200000000-0000-0000-0000-000000000000%2522%257d'
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('should correctly parse valid alternative style teams url', () => {
    const result = getTeamsMeetingLink(
      '?meetingURL=https%3a%2f%2fvisit.teams.microsoft.com%2fwebrtc-svc%2fapi%2froute%3ftid%0000000000-0000-0000-0000-000000000000%26convId%3d19%3ameeting_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%40thread.v2%26oid%3d00000000-0000-0000-0000-000000000000%26JoinWebUrl%3dhttps%253a%252f%252fteams.microsoft.com%252fl%252fmeetup-join%252f19%25253ameeting_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%252540thread.v2%252f0%253fcontext%253d%25257b%252522Tid%252522%25253a%25252200000000-0000-0000-0000-000000000000%252522%25252c%252522Oid%252522%25253a%25252200000000-0000-0000-0000-000000000000%252522%25257d%2526webjoin%253dtrue%2526unified%253dtrue%26bid%3dAAAAAAAAAAAAAAAAAAAAAAA%40AAAAAAAAAAAAAAAAAAAAAA.AAAAAAAAAAA.com%26biz%3d0%26aE%3dFalse%26ssid%3dAAAAAAAAAAAAAAAAAAAAAAA'
    );
    expect(result.meetingLink).toBe(
      'https://teams.microsoft.com/l/meetup-join/19%3ameeting_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%40thread.v2/0?context=%7B%22Tid%22%3A%2200000000-0000-0000-0000-000000000000%22%2C%22Oid%22%3A%2200000000-0000-0000-0000-000000000000%22%7D'
    );
  });

  test('should throw exception when unable to parse alternative style teams url (missing query parameter)', () => {
    try {
      getTeamsMeetingLink(
        '?meetingURL=https%3a%2f%2fvisit.teams.microsoft.com%2fwebrtc-svc%2fapi%2froute%3ftid%0000000000-0000-0000-0000-000000000000%26convId%3d19%3ameeting_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%40thread.v2%26oid%3d00000000-0000-0000-0000-000000000000'
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe('getCurrentMeetingUrl', () => {
  test('should get teams meeting url as input by user from current query string', () => {
    const result = getCurrentMeetingURL('?meetingURL=https%3A%2F%2Fteams.microsoft.com%2Fl%2Fmeetup-join');

    expect(result).toBe('https://teams.microsoft.com/l/meetup-join');
  });

  test('should get blank for the case when user does not add meeting url to query string', () => {
    const result = getCurrentMeetingURL('visit/');

    expect(result).toBe('');
  });
});

describe('getChatThreadIdFromTeamsLink', () => {
  test('should get threadId from teams link', () => {
    const meetingLink =
      'https://teams.microsoft.com/l/meetup-join/19%3ameeting_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%40thread.v2/0?context=%7b%22Tid%22%3a%2200000000-0000-0000-0000-000000000000%22%2c%22Oid%22%3a%2200000000-0000-0000-0000-000000000000%22%7d';

    const result = getChatThreadIdFromTeamsLink(meetingLink);

    expect(result).toBe('19:meeting_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@thread.v2');
  });

  test('should get threadId for channel meetings from teams link', () => {
    const meetingLink =
      'https://teams.microsoft.com/l/meetup-join/19%3a345a57dbe24740eaaf554236a5926109%40thread.skype/1649187156450?context=%7b%22Tid%22%3a%2272f988bf-86f1-41af-91ab-2d7cd011db47%22%2c%22Oid%22%3a%22dbb145ba-04a1-4f52-8008-acf251710e75%22%7d';

    const result = getChatThreadIdFromTeamsLink(meetingLink);

    expect(result).toBe('19:345a57dbe24740eaaf554236a5926109@thread.skype');
  });

  test('should throw exception when parse invalid threadId in teams link', () => {
    const meetingLink =
      'https://teams.microsoft.com/l/meetup-join/19%3a123%40threa123d.v2/0?context=%7b%22Tid%22%3a%2200000000-0000-0000-0000-000000000000%22%2c%22Oid%22%3a%2200000000-0000-0000-0000-000000000000%22%7d';

    expect(() => getChatThreadIdFromTeamsLink(meetingLink)).toThrowError('Could not get chat thread from teams link');
  });
});

describe('getRoomCallLocator', () => {
  test('should get the roomCallLocator from valid rooms url', () => {
    const result = getRoomCallLocator('roomId=mockRoomId&userId=mockUserId');
    const mockRoomsLocator: RoomCallLocator = {
      roomId: 'mockRoomId'
    };
    expect(result).toStrictEqual(mockRoomsLocator);
  });

  test('should throw exception when unable to parse roomId from rooms url', () => {
    try {
      getRoomCallLocator('incorrecturl');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe('getRoomsUserId', () => {
  test('should get the participantId from valid rooms url', () => {
    const result = getRoomsUserId('roomId=mockRoomId&userId=mockUserId');
    expect(result).toBe('mockUserId');
  });

  test('should throw exception when unable to parse psrticipantId from rooms url', () => {
    try {
      getRoomsUserId('incorrecturl');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe('makeTeamsJoinUrl', () => {
  test('should make correct teams join url', () => {
    const result = makeTeamsJoinUrl('mockTeamsMeetingUrl');
    expect(result).toBe('?meetingURL=mockTeamsMeetingUrl');
  });

  test('should make correct rooms join url', () => {
    const result = makeRoomsJoinUrl('mockRoomId', 'mockUserId');
    expect(result).toBe('/visit?roomId=mockRoomId&userId=mockUserId');
  });
});

describe('isValidTeamsLink', () => {
  test('should return true if link starts with correct path', () => {
    const meetingLink =
      'https://teams.microsoft.com/l/meetup-join/19%3a123%40threa123d.v2/0?context=%7b%22Tid%22%3a%2200000000-0000-0000-0000-000000000000%22%2c%22Oid%22%3a%2200000000-0000-0000-0000-000000000000%22%7d';
    const result = isValidTeamsLink(meetingLink);
    expect(result).toBe(true);
  });

  test('should return false if link does not start with correct path', () => {
    const meetingLink =
      'https://example.org/l/meetup-join/19%3a123%40threa123d.v2/0?context=%7b%22Tid%22%3a%2200000000-0000-0000-0000-000000000000%22%2c%22Oid%22%3a%2200000000-0000-0000-0000-000000000000%22%7d';
    const result = isValidTeamsLink(meetingLink);
    expect(result).toBe(false);
  });
});

describe('isValidRoomsLink', () => {
  test('should return true if RoomsMeetingUrl is valid', () => {
    global.window = Object.create(window);
    const url = 'http://localhost:8080';
    Object.defineProperty(window, 'location', {
      value: {
        origin: url
      }
    });
    expect(window.location.origin).toEqual(url);
    const mockUrl = 'http://localhost:8080/visit?roomId=mockRoomId&userId=mockUserId';

    const isRoomsLink = isValidRoomsLink(mockUrl);
    expect(isRoomsLink).toBe(true);
  });

  test('should return false if RoomsMeetingUrl does not have roomId query parameter', () => {
    global.window = Object.create(window);
    const url = 'http://localhost:8080';
    Object.defineProperty(window, 'location', {
      value: {
        origin: url
      }
    });
    expect(window.location.origin).toEqual(url);
    const mockUrl = 'http://localhost:8080/visit?userId=mockUserId';

    const isRoomsLink = isValidRoomsLink(mockUrl);
    expect(isRoomsLink).toBe(false);
  });

  test('should return false if RoomsMeetingUrl does not have userId query parameter', () => {
    global.window = Object.create(window);
    const url = 'http://localhost:8080';
    Object.defineProperty(window, 'location', {
      value: {
        origin: url
      }
    });
    expect(window.location.origin).toEqual(url);
    const mockUrl = 'http://localhost:8080/visit?roomId=mockRoomId';

    const isRoomsLink = isValidRoomsLink(mockUrl);
    expect(isRoomsLink).toBe(false);
  });

  test('should return false if RoomsMeetingUrl does not start with correct path', () => {
    global.window = Object.create(window);
    const url = 'http://localhost:8080';
    Object.defineProperty(window, 'location', {
      value: {
        origin: url
      }
    });
    expect(window.location.origin).toEqual(url);
    const mockUrl = 'https://example.org/visit?roomId=mockRoomId&userId=mockUserId';

    const isRoomsLink = isValidRoomsLink(mockUrl);
    expect(isRoomsLink).toBe(false);
  });

  test('should return false an error is thrown', () => {
    const invalidUrl = 'not a real url';
    const isRoomsLink = isValidRoomsLink(invalidUrl);
    expect(isRoomsLink).toBe(false);
  });
});
