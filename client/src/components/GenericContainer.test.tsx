// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as renderer from 'react-test-renderer';
import { generateTheme } from '../utils/ThemeGenerator';
import GenericContainer from './GenericContainer';

describe('DefaultContainer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it.each([['desktop'], ['mobile']])('uses correct styles if form factor is %s', async (formFactor: string) => {
    const theme = generateTheme('#FFFFFF');

    const userAgent =
      formFactor === 'mobile'
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1'
        : 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0';

    const userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get');
    userAgentGetter.mockReturnValue(userAgent);

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
