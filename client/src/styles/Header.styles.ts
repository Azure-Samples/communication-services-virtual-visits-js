// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonStyles, INavStyles, IPanelStyles, ITextStyles } from '@fluentui/react';
import { Theme } from '@fluentui/theme';

const HEADER_HEIGHT = '3rem';

export function wafflePanelStyles(theme: Theme): Partial<IPanelStyles> {
  return {
    root: {
      top: 0,
      zIndex: 100,
      position: 'fixed'
    },
    navigation: {
      height: HEADER_HEIGHT,
      justifyContent: 'flex-start'
    },
    content: { padding: 0 }
  };
}

export function headerContainerStyles(theme: Theme): any {
  return {
    root: {
      width: '100%',
      height: HEADER_HEIGHT,
      backgroundColor: theme.palette.themePrimary
    }
  };
}

export function panelMenuIconStyles(theme: Theme): IButtonStyles {
  return {
    icon: {
      color: theme.palette.themePrimary,
      fontSize: '24px'
    },
    root: {
      width: HEADER_HEIGHT,
      height: HEADER_HEIGHT
    }
  };
}

export function headerMenuIconStyles(theme: Theme): IButtonStyles {
  return {
    icon: {
      color: theme.semanticColors.primaryButtonText,
      fontSize: '24px'
    },
    root: {
      width: HEADER_HEIGHT,
      height: HEADER_HEIGHT,
      selectors: {
        ':hover .ms-Button-icon': {
          color: theme.palette.themePrimary
        }
      }
    }
  };
}

export function headerTextStyles(theme: Theme): ITextStyles {
  return {
    root: {
      fontSize: '1rem',
      paddingLeft: '1.5rem',
      color: theme.semanticColors.primaryButtonText
    }
  };
}

export const wafflePanelNavigationStyles: Partial<INavStyles> = {
  root: {
    width: '100%',
    height: '100%',
    overflowY: 'auto'
  }
};
