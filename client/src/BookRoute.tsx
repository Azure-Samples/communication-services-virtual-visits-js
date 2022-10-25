// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import ReactDOM from 'react-dom';
import { Book } from './Book';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { CookiesProvider } from 'react-cookie';

initializeIcons();

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <Book />
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
