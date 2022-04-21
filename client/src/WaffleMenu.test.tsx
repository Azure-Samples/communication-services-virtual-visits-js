// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { setIconOptions, Panel } from '@fluentui/react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as renderer from 'react-test-renderer';
import { WaffleMenu, WaffleNavigation } from './WaffleMenu';
import { runFakeTimers } from './utils/TestUtils';

configure({ adapter: new Adapter() });

// Disable icon warnings for tests as we don't register the icons for unit tests which causes warnings.
// See: https://github.com/microsoft/fluentui/wiki/Using-icons#test-scenarios
setIconOptions({
  disableWarnings: true
});

describe('WaffleMenu', () => {
  it('should have a Waffle icon and a closed Panel', async () => {
    const waffleMenu = mount(<WaffleMenu parentid="test" />);

    const menuIcon = waffleMenu.find({ iconName: 'Waffle' });
    const panel = waffleMenu.find(Panel);

    expect(menuIcon.length).toBe(1);
    expect(panel.length).toBe(1);
    expect(panel.first().prop('isOpen')).toBe(false);
  });

  it('should open its Panel when Waffle icon is clicked on', async () => {
    const waffleMenu = mount(<WaffleMenu parentid="test" />);

    const menuIcon = waffleMenu.find({ iconName: 'Waffle' });

    menuIcon.simulate('click');

    await runFakeTimers();

    waffleMenu.update();

    const panel = waffleMenu.find(Panel);

    expect(panel.length).toBe(1);
    expect(panel.first().prop('isOpen')).toBe(true);
  });

  it('panel should have links to the book and visit page', () => {
    const waffleNavigationTree = renderer.create(<WaffleNavigation />).toJSON();
    expect(waffleNavigationTree).toMatchSnapshot();
  });
});
