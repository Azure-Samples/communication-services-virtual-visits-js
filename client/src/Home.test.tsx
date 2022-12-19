// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mount } from 'enzyme';
import * as FetchConfig from './utils/FetchConfig';
import * as CreateRoom from './utils/FetchRoomsResponse';
import { runFakeTimers } from './utils/TestUtils';
import { Header } from './Header';
import { Spinner } from '@fluentui/react';
import { Home } from './Home';
import { AppConfigModel } from './models/ConfigModel';
import { GenericError } from './components/GenericError';
import { CreateRoomResponse } from './models/RoomModel';

describe('Home', () => {
  it('should render loading spinner when config is not loaded', async () => {
    const fetchConfigSpy = jest.spyOn(FetchConfig, 'fetchConfig');
    fetchConfigSpy.mockReturnValue(Promise.resolve(undefined));

    const home = mount(<Home />);

    await runFakeTimers();

    home.update();

    const spinners = home.find(Spinner);
    const headers = home.find(Header);

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

    const home = mount(<Home />);

    await runFakeTimers();

    home.update();

    const spinners = home.find(Spinner);
    const genericErrors = home.find(GenericError);

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

    const home = mount(<Home />);

    await runFakeTimers();

    home.update();

    const spinners = home.find(Spinner);
    const genericErrors = home.find(GenericError);

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

    const home = mount(<Home />);

    await runFakeTimers();

    home.update();

    const spinners = home.find(Spinner);
    const genericErrors = home.find(GenericError);

    expect(spinners.length).toBe(0);
    expect(genericErrors.length).toBe(1);
  });
});
