// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IconButton, Text, setIconOptions, Panel } from '@fluentui/react';
import { mount } from 'enzyme';
import { Header, WaffleNavigation } from './Header';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as renderer from 'react-test-renderer';

configure({ adapter: new Adapter() });

// Disable icon warnings for tests as we don't register the icons for unit tests which causes warnings.
// See: https://github.com/microsoft/fluentui/wiki/Using-icons#test-scenarios
setIconOptions({
  disableWarnings: true
});

describe('Header', () => {
  it('should render icon, waffle menu with panel, and company name', () => {
    const header = mount(<Header companyName="test" parentid="test" />);

    const waffleButton = header.find(IconButton);
    const companyText = header.find(Text);
    const waffleMenu = header.find('WaffleMenu');
    const panel = header.find(Panel);

    expect(waffleButton.length).toBe(1);
    expect(companyText.length).toBe(1);
    expect(waffleMenu.length).toBe(1);
    expect(panel.length).toBe(1);
  });

  it('panel should open when waffle icon is clicked on', () => {
    const header = mount(<Header companyName="test" parentid="test" />);

    const menuIcon = header.find({ iconName: 'Waffle' });
    const waffleMenu = header.find('WaffleMenu');
    waffleMenu.setState({ isOpen: false });

    menuIcon.simulate('click');
    expect(waffleMenu.state('isOpen')).toBe(true);
  });

  it('panel should have links to the book and visit page', () => {
    const waffleNavigationTree = renderer.create(<WaffleNavigation />).toJSON();
    expect(waffleNavigationTree).toMatchSnapshot();
  });
});
