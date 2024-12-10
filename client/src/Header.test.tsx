// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { render } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  it('should render icon, waffle menu with panel, and company name', () => {
    const header = render(<Header companyName="test" parentid="test" />);

    const waffleButton = header.queryAllByRole('button');
    const companyText = header.queryAllByRole('text');
    const waffleMenu = header.queryAllByTestId('waffle-panel-icon-button');
    const panel = header.queryAllByTestId('waffle-panel');

    expect(waffleButton.length).toBe(1);
    expect(companyText.length).toBe(1);
    expect(waffleMenu.length).toBe(1);
    expect(panel.length).toBe(1);
  });
});
