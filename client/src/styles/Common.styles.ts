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
