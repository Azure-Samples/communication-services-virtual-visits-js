// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export const buildUrl = (
  serverUrl: string,
  page: string,
  meetingLink?: string
): string => {
  if (meetingLink === undefined) {
    return `${serverUrl}/${page}`;
  } else {
    return `${serverUrl}/${page}/?meetingURL=${encodeURIComponent(
      meetingLink
    )}`;
  }
};

export const DELAY_MS = 1200;

const getGUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const randomNumber = (Math.random() * 16) | 0;
    const randomValue = c == "x" ? randomNumber : (randomNumber & 0x3) | 0x8;
    return randomValue.toString(16);
  });
};

export const testMeetingUrl = `https://teams.microsoft.com/l/meetup-join/19%3ameeting_MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM%40thread.v2/0?context=%7b%22Tid%22%3a%22${getGUID()}%22%2c%22Oid%22%3a%22${getGUID()}%22%7d`;

export const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
