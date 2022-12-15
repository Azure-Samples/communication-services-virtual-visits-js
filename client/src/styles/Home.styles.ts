// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonStyles } from '@fluentui/react';
import { PartialTheme, Theme } from '@fluentui/theme';
import { CSSProperties } from 'react';

export const fullScreenStyles = {
  root: {
    width: '100%',
    height: '100%'
  }
};

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
    width: '100%'
  }
};

export const buttonTextStyles = {
  root: {
    fontSize: '.84rem',
    fontWeight: '600',
    marginLeft: '.2rem'
  }
};

export const getButtonStyles = (theme: PartialTheme | Theme): IButtonStyles => {
  return {
    root: {
      borderColor: '#E1DFDD',
      minWidth: '12.175rem',
      width: '32.33%',
      fontSize: '.85rem',
      marginBottom: '.5rem',
      padding: '0',
      color: theme.palette?.themePrimary
    }
  };
};

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

export const containerMarginTop2rem = {
  root: { marginTop: '2rem' }
};
