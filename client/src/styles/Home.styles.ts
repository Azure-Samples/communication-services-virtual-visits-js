// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PartialTheme, Theme } from '@fluentui/theme';
import { CSSProperties } from 'react';

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

export const textDecorationNone: CSSProperties = {
  textDecoration: 'none'
};

export const newWindowIconWrapper: CSSProperties = {
  display: 'flex',
  alignItems: 'center'
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

export const imageStyles = {
  root: {
    width: '23.75rem',
    height: '6.25rem'
  }
};

export const innerContainer = {
  root: {
    width: '600px',
    marginTop: '61px'
  }
};

export const buttonStyle = {
  root: {
    width: '189px',
    borderColor: '#E1DFDD',
    fontSize: '12px'
  }
};

export const btnStackStyles = {
  root: {
    marginBottom: '24px'
  }
};

export const font16pxStyle = {
  root: {
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '22px'
  }
};

export const font12pxSemiBoldStyle = {
  root: {
    fontWeight: '600',
    fontSize: '12px',
    lineHeight: '16px'
  }
};

export const font12pxWeight400Style = {
  root: {
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '16px'
  }
};

export const lineHeight28px = {
  root: { fontWeight: '600', fontSize: '20px', lineHeight: '28px' }
};

export const lineHeight22px = {
  root: { fontWeight: '600', fontSize: '16px', lineHeight: '22px', marginBottom: '16px' }
};

export const layerHostStyles: CSSProperties = {
  position: 'relative',
  height: '100%',
  width: '100%'
};
