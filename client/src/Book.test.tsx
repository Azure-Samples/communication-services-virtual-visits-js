// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Spinner } from '@fluentui/react';
import { mount } from 'enzyme';
import { Book } from './Book';
import { Header } from './Header';
import { GenericError } from './components/GenericError';
import { AppConfigModel } from './models/ConfigModel';
import * as FetchConfig from './utils/FetchConfig';
import { runFakeTimers } from './utils/TestUtils';
import { generateTheme } from './utils/ThemeGenerator';
import * as renderer from 'react-test-renderer';
import { BOOKINGS_SPECIMEN_URL } from './utils/Constants';
import WarningBanner from './components/book/WarningBanner';

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

  it('should render header and bookings iframe when config is loaded and bookings link is not empty', async () => {
    const mockBookingsUrl = 'https://example.org';
    const fetchConfigSpy = jest.spyOn(FetchConfig, 'fetchConfig');
    fetchConfigSpy.mockReturnValue(
      Promise.resolve({
        communicationEndpoint: 'endpoint=test_endpoint;',
        microsoftBookingsUrl: mockBookingsUrl,
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
    const warningBanner = book.find(WarningBanner);

    expect(spinners.length).toBe(0);
    expect(warningBanner.length).toBe(0);
    expect(headers.length).toBe(1);
    expect(iframes.length).toBe(1);
    expect(iframes.first().props().src).toBe(mockBookingsUrl);
  });

  it('should render header and no scheduling info when config is loaded and bookings link is empty', async () => {
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
    const warningBanner = book.find(WarningBanner);

    expect(spinners.length).toBe(0);
    expect(warningBanner.length).toBe(0);
    expect(headers.length).toBe(1);
    expect(iframes.length).toBe(0);
  });

  it('should render warning banner if using specimen Bookings page', async () => {
    const fetchConfigSpy = jest.spyOn(FetchConfig, 'fetchConfig');
    fetchConfigSpy.mockReturnValue(
      Promise.resolve({
        communicationEndpoint: 'endpoint=test_endpoint;',
        microsoftBookingsUrl: BOOKINGS_SPECIMEN_URL,
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

    const warningBanner = book.find(WarningBanner);

    const spinners = book.find(Spinner);
    const headers = book.find(Header);
    const iframes = book.find('iframe');

    expect(spinners.length).toBe(0);
    expect(warningBanner.length).toBe(1);
    expect(headers.length).toBe(1);
    expect(iframes.length).toBe(1);
    expect(iframes.first().props().src).toBe(BOOKINGS_SPECIMEN_URL);
  });

  it('should match snapshot when bookings link is empty', async () => {
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
    const book = renderer.create(<Book />);
    await runFakeTimers();

    expect(book.toJSON()).toMatchSnapshot();
  });
});
