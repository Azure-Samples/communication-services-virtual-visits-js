// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon, Stack, Text } from '@fluentui/react';
import { errorIconStackStyle, errorTitleStyle } from '../styles/GenericError.styles';

interface GenericErrorProps {
  statusCode: any | undefined;
}

export const GenericError = (props: GenericErrorProps): JSX.Element => {
  const { statusCode } = props;
  const error = genericErrors[statusCode] || genericErrors['default'];

  return (
    <Stack id="generic-error">
      <Text as={'h2'} className={errorIconStackStyle}>
        <Icon iconName="error" />
      </Text>
      <Text as={'h3'} className={errorTitleStyle}>
        {error.title}
      </Text>
      <Text>{error.description}</Text>
    </Stack>
  );
};

const genericErrors = {
  default: {
    title: 'Unknown error',
    description: 'An unknown error has occurred.'
  },
  404: {
    title: '404: Page not found',
    description: 'The requested page could not be found.'
  },
  500: {
    title: '500: Internal server error',
    description: 'The server has encountered an error. Refresh the page to try again.'
  }
};
