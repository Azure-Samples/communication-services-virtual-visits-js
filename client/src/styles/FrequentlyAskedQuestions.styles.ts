// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CSSProperties } from 'react';
import { PartialTheme, Theme } from '@fluentui/theme';

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

export const font16pxStyle = {
  root: {
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '22px'
  }
};

export const btnStackStyles = {
  root: {
    marginBottom: '24px'
  }
};

export const linkStyles: CSSProperties = {
  textDecoration: 'underline',
  paddingRight: ' 8px',
  fontSize: '15px',
  fontWeight: '400',
  lineHeight: '20px',
  fontFamily: 'sf pro text',
  verticalAlign: 'bottom',
  letterSpacing: '-0.24px'
};

export const textDecorationNone: CSSProperties = {
  textDecoration: 'none'
};

export const newWindowIconWrapper: CSSProperties = {
  display: 'flex',
  alignItems: 'center'
};

export const lineHeight28px = {
  root: { fontWeight: '600', fontSize: '20px', lineHeight: '28px' }
};

export const lineHeight22px = {
  root: { fontWeight: '600', fontSize: '16px', lineHeight: '22px', marginBottom: '16px' }
};
