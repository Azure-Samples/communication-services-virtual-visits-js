// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import HomeComponent from './HomeComponent';
import renderer from 'react-test-renderer';
import { generateTheme } from '../../utils/ThemeGenerator';

describe('HomeComponent', () => {
  it('should render home page', () => {
    const home = renderer
      .create(
        <HomeComponent companyName="Lamna Healthcare" theme={generateTheme('#0078d4')} onDisplayError={jest.fn()} />
      )
      .toJSON();
    expect(home).toMatchSnapshot();
  });
});
