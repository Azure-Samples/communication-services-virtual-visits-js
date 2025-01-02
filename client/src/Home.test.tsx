// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as FetchConfig from './utils/FetchConfig';
import * as CreateRoom from './utils/FetchRoomsResponse';
import { runFakeTimers } from './utils/TestUtils';
import { Home } from './Home';
import { AppConfigModel } from './models/ConfigModel';
import { CreateRoomResponse } from './models/RoomModel';
import { render } from '@testing-library/react';

describe('Home', () => {
  it('should render loading spinner when config is not loaded', async () => {
    const fetchConfigSpy = jest.spyOn(FetchConfig, 'fetchConfig');
    fetchConfigSpy.mockReturnValue(Promise.resolve(undefined));

    const home = render(<Home />);

    await runFakeTimers();

    const spinners = home.queryAllByTestId('spinner');
    const headers = home.queryAllByTestId('header');

    expect(spinners.length).toBe(1);
    expect(headers.length).toBe(0);
  });

  it('renders a generic error when config throws an error', async () => {
    const fetchConfigSpy = jest.spyOn(FetchConfig, 'fetchConfig');
    fetchConfigSpy.mockImplementation(
      async (): Promise<AppConfigModel | undefined> => {
        throw new Error('test error');
      }
    );

    const home = render(<Home />);

    await runFakeTimers();

    const spinners = home.queryAllByTestId('spinner');
    const genericErrors = home.queryAllByTestId('generic-error');

    expect(spinners.length).toBe(0);
    expect(genericErrors.length).toBe(1);
  });

  it('renders a generic error when createRoom throws an error', async () => {
    const createRoomSpy = jest.spyOn(CreateRoom, 'createRoom');
    createRoomSpy.mockImplementation(
      async (): Promise<CreateRoomResponse> => {
        throw new Error('test error');
      }
    );

    const home = render(<Home />);

    await runFakeTimers();

    const spinners = home.queryAllByTestId('spinner');
    const genericErrors = home.queryAllByTestId('generic-error');

    expect(spinners.length).toBe(0);
    expect(genericErrors.length).toBe(1);
  });

  it('renders a generic error when createRoom throws an error', async () => {
    const createRoomSpy = jest.spyOn(CreateRoom, 'createRoom');
    createRoomSpy.mockImplementation(
      async (): Promise<CreateRoomResponse> => {
        throw new Error('test error');
      }
    );

    const home = render(<Home />);

    await runFakeTimers();

    const spinners = home.queryAllByTestId('spinner');
    const genericErrors = home.queryAllByTestId('generic-error');

    expect(spinners.length).toBe(0);
    expect(genericErrors.length).toBe(1);
  });
});
