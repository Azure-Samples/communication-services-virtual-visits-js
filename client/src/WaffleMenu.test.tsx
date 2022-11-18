// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Panel } from '@fluentui/react';
import { mount } from 'enzyme';
import * as renderer from 'react-test-renderer';
import { WaffleMenu, WaffleNavigation } from './WaffleMenu';
import { runFakeTimers } from './utils/TestUtils';

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
