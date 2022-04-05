// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { Icon } from '@fluentui/react';

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

interface GenericErrorProps {
  statusCode: any | undefined;
}

export class GenericError extends React.Component<GenericErrorProps> {
  public constructor(props: GenericErrorProps) {
    super(props);
  }

  render(): JSX.Element {
    const error = genericErrors[this.props.statusCode] || genericErrors['default'];

    return (
      <div id="generic-error">
        <h2>
          <Icon iconName="error" />
        </h2>
        <h3>{error.title}</h3>
        <p>{error.description}</p>
      </div>
    );
  }
}
