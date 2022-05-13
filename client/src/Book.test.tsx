// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { setIconOptions, Spinner } from '@fluentui/react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Book } from './Book';
import { Header } from './Header';
import { GenericError } from './components/GenericError';
import { AppConfigModel } from './models/ConfigModel';
import * as FetchConfig from './utils/FetchConfig';
import { runFakeTimers } from './utils/TestUtils';
import { generateTheme } from './utils/ThemeGenerator';

configure({ adapter: new Adapter() });

// Disable icon warnings for tests as we don't register the icons for unit tests which causes warnings.
// See: https://github.com/microsoft/fluentui/wiki/Using-icons#test-scenarios
setIconOptions({
  disableWarnings: true
});

describe('Book', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation();
  });

  it('should render loading spinner when config is not loaded', async () => {
    const fetchConfigSpy = jest.spyOn(FetchConfig, 'fetchConfig');
    fetchConfigSpy.mockReturnValue(Promise.resolve(undefined));

    const book = await mount(<Book />);

    await runFakeTimers();

    book.update();

    const spinners = book.find(Spinner);
    const headers = book.find(Header);

    expect(spinners.length).toBe(1);
    expect(headers.length).toBe(0);
  });

  it('renders an generic error UI when config throws an error', async () => {
    const fetchConfigSpy = jest.spyOn(FetchConfig, 'fetchConfig');
    fetchConfigSpy.mockImplementation(
      async (): Promise<AppConfigModel | undefined> => {
        throw new Error('test error');
      }
    );

    const book = await mount(<Book />);

    await runFakeTimers();

    book.update();

    const spinners = book.find(Spinner);
    const genericError = book.find(GenericError);

    expect(spinners.length).toBe(0);
    expect(genericError.length).toBe(1);
  });

  it('should render header and bookings iframe when config is loaded', async () => {
    const fetchConfigSpy = jest.spyOn(FetchConfig, 'fetchConfig');
    fetchConfigSpy.mockReturnValue(
      Promise.resolve({
        communicationEndpoint: 'endpoint=test_endpoint;',
        microsoftBookingsUrl: '',
        chatEnabled: true,
        screenShareEnabled: true,
        companyName: '',
        theme: generateTheme('#FFFFFF'),
        waitingTitle: '',
        waitingSubtitle: '',
        logoUrl: ''
      } as AppConfigModel)
    );

    const book = await mount(<Book />);

    await runFakeTimers();

    book.update();

    const spinners = book.find(Spinner);
    const headers = book.find(Header);
    const iframes = book.find('iframe');

    expect(spinners.length).toBe(0);
    expect(headers.length).toBe(1);
    expect(iframes.length).toBe(1);
  });
});
