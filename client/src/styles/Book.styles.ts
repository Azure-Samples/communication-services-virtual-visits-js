// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PartialTheme, Theme } from '@fluentui/theme';

export const embededIframeStyles = {
  width: '100%',
  height: '100%',
  border: '0px'
};

export const fullScreenStyles = {
  root: {
    width: '100%',
    height: '100%'
  }
};

export function containerStyles(theme: PartialTheme | Theme | undefined): any {
  return {
    root: {
      maxWidth: '64rem',
      width: '100%',
      height: '100%',
      display: 'flex',
      margin: 'auto',
      marginTop: '38px',
      backgroundColor: 'white',
      borderRadius: theme?.effects?.roundedCorner4
    }
  };
}

export const innerContainer = {
  root: {
    width: '600px',
    marginTop: '200px'
  }
};

export const lineHeight28px = {
  root: { fontWeight: '600', fontSize: '20px', lineHeight: '28px' }
};

export const lineHeight22px = {
  root: { fontWeight: '600', fontSize: '16px', lineHeight: '22px', marginBottom: '16px' }
};
