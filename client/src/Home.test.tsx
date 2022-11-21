// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { HomeComponent } from './components/home/Home';
import renderer from 'react-test-renderer';

configure({ adapter: new Adapter() });

describe('HomePage tests', () => {
  it('should render home page', () => {
    const home = renderer.create(<HomeComponent companyName="Lamna Healthcare" />).toJSON();
    expect(home).toMatchSnapshot();
  });
});
