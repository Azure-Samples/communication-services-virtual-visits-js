// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export const buildUrl = (serverUrl: string, page: string): string =>
  `${serverUrl}/${page}`;

export const DELAY_MS = 1200;

function getGUID() {
  let timeStamp = new Date().getTime();
  let timeInMilliSec =
    (performance && performance.now && performance.now() * 1000) || 0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
    digit
  ) {
    let randomNumber = Math.random() * 16; //random number between 0 and 16
    if (timeStamp > 0) {
      //Use timestamp until depleted
      randomNumber = (timeStamp + randomNumber) % 16 | 0;
      timeStamp = Math.floor(timeStamp / 16);
    } else {
      //Use microseconds since page-load if supported
      randomNumber = (timeInMilliSec + randomNumber) % 16 | 0;
      timeInMilliSec = Math.floor(timeInMilliSec / 16);
    }
    return (digit === "x" ? randomNumber : (randomNumber & 0x3) | 0x8).toString(
      16
    );
  });
}

export const testMeetingUrl = `https://teams.microsoft.com/l/meetup-join/19%3ameeting_MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM%40thread.v2/0?context=%7b%22Tid%22%3a%22${getGUID()}%22%2c%22Oid%22%3a%22${getGUID()}%22%7d`;

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
