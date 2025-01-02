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

    const menuButton = waffleMenu.getByTestId('waffle-menu-button');

    // Panel should be closed
    expect(menuButton.nextSibling).toBeNull();
  });

  it('should open its Panel when Waffle icon is clicked on', async () => {
    const waffleMenu = render(<WaffleMenu parentid="test" />);

    const menuButton = waffleMenu.getByTestId('waffle-menu-button');

    React.act(() => {
      fireEvent.click(menuButton);
    });

    await runFakeTimers();

    // Panel should be open
    expect(menuButton.nextSibling).not.toBeNull();
  });

  it('panel should have links to the book and visit page', () => {
    const waffleNavigationTree = renderer.create(<WaffleNavigation />).toJSON();
    expect(waffleNavigationTree).toMatchSnapshot();
  });
});
