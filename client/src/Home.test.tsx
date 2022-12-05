// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { HomeComponent } from './components/home/HomeComponent';
import renderer from 'react-test-renderer';
import * as FetchConfig from './utils/FetchConfig';
import * as CreateRoom from './utils/FetchRoomsResponse';
import { runFakeTimers } from './utils/TestUtils';
import { Header } from './Header';
import { Spinner } from '@fluentui/react';
import { Home } from './Home';
import { AppConfigModel } from './models/ConfigModel';
import { GenericError } from './components/GenericError';
import { generateTheme } from './utils/ThemeGenerator';
import { CreateRoomResponse } from './models/RoomModel';

configure({ adapter: new Adapter() });

describe('HomePage tests', () => {
  it('should render home page', () => {
    const home = renderer
      .create(
        <HomeComponent companyName="Lamna Healthcare" theme={generateTheme('#0078d4')} onDisplayError={jest.fn()} />
      )
      .toJSON();
    expect(home).toMatchSnapshot();
  });

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
});
