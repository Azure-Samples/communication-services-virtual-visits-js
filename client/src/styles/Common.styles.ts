// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Theme } from '@fluentui/theme';

export function backgroundStyles(_theme: Theme): any {
  return {
    root: {
      width: '100%',
      height: '100%',
      backgroundColor: '#f4f4f4'
    }
  };
}

export const fullSizeStyles = {
  root: {
    width: '100%',
    height: '100%'
  }
};

export const getDefaultLayerHostStyles = (): any => {
  return {
    position: 'relative',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
};

export const getDefaultContainerStyles = (theme: Theme, mobile: string | null): any => {
  if (mobile) {
    return {
      root: {
        maxWidth: '64rem',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0rem auto',
        paddingLeft: '2rem',
        paddingRight: '2rem',
        backgroundColor: '#ffffff',
        borderRadius: theme.effects.roundedCorner4
      }
    };
  }

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
};
