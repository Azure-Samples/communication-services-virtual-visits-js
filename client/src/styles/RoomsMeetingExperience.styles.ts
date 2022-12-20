// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IMessageBarStyleProps, IMessageBarStyles, IRawStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';

export const inviteInstructionsContainerStyles = {
  // CallComposite configuration screen has a height of about 24.75 rem
  // Hence the 14rem value to account for margins and paddings as well
  root: {
    bottom: 'calc(50% - 14rem)',
    width: '100%',
    position: 'absolute',
    padding: '0.5rem',
    flexGrow: '1'
  } as IRawStyle
};

export const getInviteInstructionsMessageBarStyles = (
  theme: ITheme
): IStyleFunctionOrObject<IMessageBarStyleProps, IMessageBarStyles> => {
  return {
    root: {
      width: '100%',
      minWidth: '24rem',
      maxWidth: '44.75rem',
      backgroundColor: theme?.palette?.themeLight
    }
  };
};

export const inviteInstructionsTextStyles = {
  root: {
    fontSize: '.75rem',
    lineHeight: '.9375rem'
  }
};
