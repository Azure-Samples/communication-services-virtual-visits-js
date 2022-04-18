// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Text, setIconOptions } from '@fluentui/react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Header } from './Header';
import { WaffleMenu } from './WaffleMenu';

configure({ adapter: new Adapter() });

// Disable icon warnings for tests as we don't register the icons for unit tests which causes warnings.
// See: https://github.com/microsoft/fluentui/wiki/Using-icons#test-scenarios
setIconOptions({
  disableWarnings: true
});

describe('Header', () => {
  it('should render WaffleMenu, and company name', () => {
    const header = mount(<Header companyName="test" parentid="test" />);

    const companyText = header.find(Text);
    const waffleMenu = header.find(WaffleMenu);

    expect(companyText.length).toBe(1);
    expect(waffleMenu.length).toBe(1);
  });
});
