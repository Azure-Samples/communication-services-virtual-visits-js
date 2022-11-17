// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { HomeComponent } from './components/home/Home';
//import renderer from 'react-test-renderer';

configure({ adapter: new Adapter() });

it('should render home page', () => {
  const home = mount(<HomeComponent companyName="Lamna Healthcare" />);
  expect(home).toMatchSnapshot();
});
