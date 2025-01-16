// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { render } from '@testing-library/react';
import * as renderer from 'react-test-renderer';
import { Book } from './Book';
import { AppConfigModel } from './models/ConfigModel';
import { BOOKINGS_SPECIMEN_URL } from './utils/Constants';
import * as FetchConfig from './utils/FetchConfig';
import { runFakeTimers } from './utils/TestUtils';
import { generateTheme } from './utils/ThemeGenerator';
import React from 'react';

describe('Book', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation();
  });

  it('should render loading spinner when config is not loaded', async () => {
    const fetchConfigSpy = jest.spyOn(FetchConfig, 'fetchConfig');
    fetchConfigSpy.mockReturnValue(Promise.resolve(undefined));

    const book = await React.act(async () => {
      return await render(<Book />);
    });

    await runFakeTimers();

    const spinners = book.queryAllByTestId('spinner');
    const headers = book.queryAllByTestId('header');

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

    const book = await React.act(async () => {
      return await render(<Book />);
    });

    await runFakeTimers();

    const spinners = book.queryAllByTestId('spinner');
    const genericError = book.queryAllByTestId('generic-error');

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

    const book = await React.act(async () => {
      return await render(<Book />);
    });

    await runFakeTimers();

    const spinners = book.queryAllByTestId('spinner');
    const headers = book.queryAllByTestId('header');
    const bookingPageIframes = book.queryAllByTitle('BookingsPageComponent');
    const warningBanner = book.queryAllByTestId('warning-banner');

    expect(spinners.length).toBe(0);
    expect(warningBanner.length).toBe(0);
    expect(headers.length).toBe(1);
    expect(bookingPageIframes.length).toBe(1);
    expect(bookingPageIframes[0].getAttribute('src')).toBe(mockBookingsUrl);
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

    const book = await React.act(async () => {
      return await render(<Book />);
    });

    await runFakeTimers();

    const spinners = book.queryAllByTestId('spinner');
    const headers = book.queryAllByTestId('header');
    const bookingPageIframes = book.queryAllByTitle('BookingsPageComponent');
    const warningBanner = book.queryAllByTestId('warning-banner');

    expect(spinners.length).toBe(0);
    expect(warningBanner.length).toBe(0);
    expect(headers.length).toBe(1);
    expect(bookingPageIframes.length).toBe(0);
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

    const book = await React.act(async () => {
      return await render(<Book />);
    });

    await runFakeTimers();

    const spinners = book.queryAllByTestId('spinner');
    const headers = book.queryAllByTestId('header');
    const bookingPageIframes = book.queryAllByTitle('BookingsPageComponent');
    const warningBanner = book.queryAllByTestId('warning-banner');

    expect(spinners.length).toBe(0);
    expect(warningBanner.length).toBe(1);
    expect(headers.length).toBe(1);
    expect(bookingPageIframes.length).toBe(1);
    expect(bookingPageIframes[0].getAttribute('src')).toBe(BOOKINGS_SPECIMEN_URL);
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
