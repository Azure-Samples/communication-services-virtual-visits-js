// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as renderer from 'react-test-renderer';
import { generateTheme } from '../../utils/ThemeGenerator';
import InviteInstructions, { InviteInstructionsText } from './InviteInstructions';

describe('InviteInstructions', () => {
  it('matches snapshot', () => {
    const theme = generateTheme('#0078d4');
    const component = renderer.create(<InviteInstructions fluentTheme={theme} />).toJSON();
    expect(component).toMatchSnapshot();
  });
});

describe('InviteInstructionsText', () => {
  it('matches snapshot', () => {
    const component = renderer.create(<InviteInstructionsText />).toJSON();
    expect(component).toMatchSnapshot();
  });
});
