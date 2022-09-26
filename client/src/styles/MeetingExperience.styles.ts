// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export const meetingExperienceLogoStyles = {
  width: '2.5rem'
};

export const callWithChatComponentStyles = (displayFlag: boolean): any => {
  return {
    display: displayFlag ? 'none' : 'flex',
    flexGrow: 1,
    position: 'relative',
    height: '100%'
  };
};
