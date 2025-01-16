// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { Header } from './Header';

describe('Header', () => {
  it('should render icon, waffle menu with panel, and company name', () => {
    const header = render(<Header companyName="company name" parentid="test" />);

    const waffleButton = header.getByTestId('waffle-menu-button');
    header.getByText('company name');

    React.act(() => {
      fireEvent.click(waffleButton);
    });

    // Panel should be open
    expect(waffleButton.nextSibling).not.toBeNull();
  });
});
