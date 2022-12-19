// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import renderer from 'react-test-renderer';
import LearnMore from './LearnMore';

describe('LearnMore', () => {
  it('should match snapshot', () => {
    const component = renderer.create(<LearnMore />).toJSON();
    expect(component).toMatchSnapshot();
  });
});
