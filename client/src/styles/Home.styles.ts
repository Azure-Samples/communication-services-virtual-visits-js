// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IIconProps } from '@fluentui/react';
import { PartialTheme, Theme } from '@fluentui/theme';
import { CSSProperties } from 'react';

export const fullScreenStyles = {
  root: {
    width: '100%',
    height: '100%'
  }
};

export function containerStyles(theme: PartialTheme | Theme): any {
  return {
    root: {
      maxWidth: '64rem',
      width: '100%',
      height: '100%',
      display: 'flex',
      margin: 'auto',
      marginTop: '2.375rem',
      backgroundColor: 'white',
      borderRadius: theme.effects?.roundedCorner4
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
  paddingRight: '.5rem',
  fontSize: '.9375rem',
  fontWeight: '400',
  lineHeight: '1rem',
  verticalAlign: 'bottom',
  letterSpacing: '-0.015rem'
};

export const imageStyles = {
  root: {
    width: '23.75rem',
    height: '6.25rem'
  }
};

export const innerContainer = {
  root: {
    maxWidth: '37.5rem',
    width: '100%',
    marginTop: '3.8125rem'
  }
};

export const buttonStyles = {
  root: {
    borderColor: '#E1DFDD',
    fontSize: '1rem',
    marginBottom: '.5rem'
  }
};

export function calendarIconStyles(theme: PartialTheme | Theme): IIconProps {
  return {
    iconName: 'Calendar',
    styles: {
      root: { color: theme.palette?.themePrimary }
    }
  };
}

export function videoIconStyles(theme: PartialTheme | Theme): IIconProps {
  return {
    iconName: 'Calendar',
    styles: {
      root: { color: theme.palette?.themePrimary }
    }
  };
}

export const btnStackStyles = {
  root: {
    marginBottom: '1.5rem',
    width: '100%',
    justifyContent: 'left'
  }
};

export const font16pxStyle = {
  root: {
    fontWeight: '600',
    fontSize: '1rem',
    lineHeight: '1.375rem'
  }
};

export const font12pxSemiBoldStyle: CSSProperties = {
  fontWeight: '600',
  fontSize: '.75rem',
  lineHeight: '1rem',
  paddingRight: '.5rem',
  verticalAlign: 'bottom'
};

export const font12pxWeight400Style = {
  root: {
    fontWeight: '400',
    fontSize: '.75rem',
    lineHeight: '1rem',
    marginBottom: '.25rem'
  }
};

export const lineHeight28px = {
  root: { fontWeight: '600', fontSize: '1.25rem', lineHeight: '1.75rem' }
};

export const lineHeight22px = {
  root: { fontWeight: '600', fontSize: '1rem', lineHeight: '1.375rem', marginBottom: '1rem' }
};

export const layerHostStyles: CSSProperties = {
  position: 'relative',
  height: '100%',
  width: '100%'
};

export function linkIconStyles(theme: PartialTheme | Theme): IIconProps {
  return {
    iconName: 'Link',
    styles: {
      root: { color: theme.palette?.themePrimary }
    }
  };
}

export const containerMarginTop2rem = {
  root: { marginTop: '2rem' }
};
