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