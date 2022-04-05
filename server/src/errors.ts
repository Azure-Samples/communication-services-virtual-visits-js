// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export const ERROR_PAYLOAD_404 = {
  errors: [
    {
      status: 404,
      title: '404: Page not found',
      detail: 'The requested page could not be found.'
    }
  ]
};

export const ERROR_PAYLOAD_500 = {
  errors: [
    {
      status: 500,
      title: '500: Internal server error',
      detail: 'The server has encountered an error. Refresh the page to try again.'
    }
  ]
};
