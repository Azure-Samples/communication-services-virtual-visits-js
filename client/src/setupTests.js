// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { setIconOptions } from '@fluentui/react';

// Disable icon warnings for tests as we don't register the icons for unit tests which causes warnings.
// See: https://github.com/microsoft/fluentui/wiki/Using-icons#test-scenarios
setIconOptions({
  disableWarnings: true
});

window.AudioContext = jest.fn().mockImplementation(() => {
  return {};
});

Object.defineProperty(window, 'MediaStreamTrack', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    contentHint: 'string',
    enabled: true,
    id: 'string',
    kind: 'string',
    label: 'string',
    muted: true,
    onended: jest.fn(),
    onmute: jest.fn(),
    onunmute: jest.fn(),
    readyState: 'live',
    applyConstraints: jest.fn(),
    clone: jest.fn(),
    getCapabilities: jest.fn(),
    getConstraints: jest.fn(),
    getSettings: jest.fn(),
    stop: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    isolated: false,
    onisolationchange: jest.fn()
  }))
});

Object.defineProperty(window, 'MediaStream', {
  writable: true,
  value: jest.fn().mockImplementation(() => Object.create(MediaStream.prototype))
});
