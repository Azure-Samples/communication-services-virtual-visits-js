// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import ReactDOM from 'react-dom';
import { Visit } from './Visit';
import { initializeIcons } from '@fluentui/react/lib/Icons';

initializeIcons();

ReactDOM.render(
  <React.StrictMode>
    <Visit />
  </React.StrictMode>,
  document.getElementById('root')
);
