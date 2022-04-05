// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Theme } from '@fluentui/theme';

export function makeJoinTeamsLayerHostStyles(): any {
  return {
    position: 'relative',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
}

export function mainJoinTeamsMeetingContainerStyles(theme: Theme): any {
  return {
    root: {
      maxWidth: '64rem',
      width: '100%',
      height: '80vmin',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 'auto',
      backgroundColor: '#ffffff',
      borderRadius: theme.effects.roundedCorner4
    }
  };
}
export function mainJoinTeamsMeetingContainerMobileStyles(theme: Theme): any {
  return {
    root: {
      maxWidth: '64rem',
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '0rem auto',
      backgroundColor: '#ffffff',
      borderRadius: theme.effects.roundedCorner4
    }
  };
}

export const formStyles = {
  root: {
    width: 300
  }
};
