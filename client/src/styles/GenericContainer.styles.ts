// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Theme } from '@fluentui/theme';

export const getGenericContainerStyles = (theme: Theme, mobile: string | null): any => {
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
      minHeight: '80vmin',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 'auto',
      backgroundColor: '#ffffff',
      borderRadius: theme.effects.roundedCorner4
    }
  };
};
