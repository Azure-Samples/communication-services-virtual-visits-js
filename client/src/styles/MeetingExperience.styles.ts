// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export const meetingExperienceLogoStyles = {
  width: '2.5rem'
};

export const callWithChatComponentStyles = (showPostCall: boolean): any => {
  return {
    display: showPostCall ? 'none' : 'flex',
    flexGrow: 1,
    position: 'relative',
    height: '100%'
  };
};
