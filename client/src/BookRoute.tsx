// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import ReactDOM from 'react-dom';
import { Book } from './Book';
import { initializeIcons } from '@fluentui/react/lib/Icons';

initializeIcons();

ReactDOM.render(
  <React.StrictMode>
    <Book />
  </React.StrictMode>,
  document.getElementById('root')
);
