// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CSSProperties } from 'react';

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
