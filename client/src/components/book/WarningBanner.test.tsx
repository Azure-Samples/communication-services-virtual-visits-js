// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as renderer from 'react-test-renderer';
import WarningBanner, { WarningMessage } from './WarningBanner';

describe('WarningBanner', () => {
  it('matches snapshot', () => {
    const component = renderer.create(<WarningBanner />).toJSON();
    expect(component).toMatchSnapshot();
  });
});

describe('WarningMessage', () => {
  it('matches snapshot', () => {
    const component = renderer.create(<WarningMessage />).toJSON();
    expect(component).toMatchSnapshot();
  });
});
