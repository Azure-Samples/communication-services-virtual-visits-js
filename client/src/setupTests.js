// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { setIconOptions } from '@fluentui/react';

configure({ adapter: new Adapter() });

// Disable icon warnings for tests as we don't register the icons for unit tests which causes warnings.
// See: https://github.com/microsoft/fluentui/wiki/Using-icons#test-scenarios
setIconOptions({
  disableWarnings: true
});
