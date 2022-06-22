// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export const buildUrl = (serverUrl: string, page: string): string =>
  `${serverUrl}/${page}`;

// export const testMeetingUrl = 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM%40thread.v2/0?context=%7b%22Tid%22%3a%22<RANDOM_GUID>%22%2c%22Oid%22%3a%22<RANDOM_GUID>%22%7d'

export const testMeetingUrl = `https://teams.microsoft.com/l/meetup-join/19%3ameeting_MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM%40thread.v2/0?context=%7b%22Tid%22%3a%2218e39d07-891f-4b59-b3a7-4aa77fe66354%22%2c%22Oid%22%3a%2218e39d07-891f-4b59-b3a7-4aa77fe66354%22%7d`;
