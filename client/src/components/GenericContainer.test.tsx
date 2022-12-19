// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as renderer from 'react-test-renderer';
import { generateTheme } from '../utils/ThemeGenerator';
import GenericContainer from './GenericContainer';

let userAgentGetter: any = undefined;

beforeEach(() => {
  userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get');
});

describe('DefaultContainer', () => {
  it.each([['desktop'], ['mobile']])('uses correct styles if form factor is %s', async (formFactor: string) => {
    const theme = generateTheme('#FFFFFF');

    if (formFactor === 'mobile') {
      const mobileSafariUserAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1';
      userAgentGetter.mockReturnValue(mobileSafariUserAgent);
    }

    const container = renderer
      .create(
        <GenericContainer layerHostId="layerHost" theme={theme}>
          <div>Hello, World!</div>
        </GenericContainer>
      )
      .toJSON();

    expect(container).toMatchSnapshot();
  });
});
