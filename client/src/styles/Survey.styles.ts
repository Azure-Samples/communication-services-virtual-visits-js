// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Theme, PartialTheme } from '@fluentui/theme';

export const surveyStyle = {
  root: { height: '100%' }
};

export const rejoinLinkStyle = { root: { height: '3rem', textDecoration: 'underline' } };

export const surveyIframeStyle = { height: '100%', width: '100%', border: 0 };

export const fullScreenStyles = {
  root: {
    width: '100%',
    height: '100%'
  }
};

export function oneQuestionPollStyle(theme: PartialTheme | Theme | undefined): any {
  return {
    root: {
      maxWidth: '64rem',
      width: '100%',
      height: '80vmin',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 'auto',
      backgroundColor: '#ffffff',
      borderRadius: theme?.effects?.roundedCorner4
    }
  };
}

export const pollPromptStyle = {
  root: {
    marginBottom: '1rem',
    fontSize: '0.938rem',
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: '20rem'
  }
};
export const starRatingLabelStyles = {
  root: {
    fontWeight: '400',
    fontSize: '0.75rem',
    lineHeight: '1rem',
    marginTop: '0.5rem',
    marginBottom: '0.5rem'
  }
};

export const pollTitleStyle = {
  root: {
    marginBottom: '1.5rem',
    fontSize: '1.25rem',
    fontWeight: '600',
    textAlign: 'center'
  }
};

export const surveySubmitButtonStyles = {
  width: '20rem',
  height: '2.5rem',
  marginTop: '1rem'
};

export const surveyTextFieldStyles = {
  root: {
    width: '20rem'
  }
};

export const spinnerStyle = {
  root: {
    paddingRight: '4px'
  }
};
