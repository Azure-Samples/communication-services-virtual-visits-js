// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import * as renderer from 'react-test-renderer';
import { WaffleMenu, WaffleNavigation } from './WaffleMenu';
import { runFakeTimers } from './utils/TestUtils';

describe('WaffleMenu', () => {
  it('should have a Waffle icon and a closed Panel', async () => {
    const waffleMenu = render(<WaffleMenu parentid="test" />);

    const menuIcon = waffleMenu.queryAllByTestId('Menu Button');
    const panel = waffleMenu.queryAllByTestId('waffle-panel');
    const nav = waffleMenu.queryAllByTestId('waffle-nav');

    expect(menuIcon.length).toBe(1);
    expect(panel.length).toBe(1);
    expect(nav.length).toBe(0);
  });

  it('should open its Panel when Waffle icon is clicked on', async () => {
    const waffleMenu = render(<WaffleMenu parentid="test" />);

    const menuIcon = waffleMenu.getByTestId('waffle-panel-icon-button');

    React.act(() => {
      fireEvent.click(menuIcon);
    });

    await runFakeTimers();

    const panel = waffleMenu.queryAllByTestId('waffle-panel');
    const nav = waffleMenu.queryAllByTestId('waffle-nav');

    expect(panel.length).toBe(1);
    expect(nav.length).toBe(1);
  });

  it('panel should have links to the book and visit page', () => {
    const waffleNavigationTree = renderer.create(<WaffleNavigation />).toJSON();
    expect(waffleNavigationTree).toMatchSnapshot();
  });
});
