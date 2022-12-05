// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mount } from 'enzyme';
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

let userAgentGetter: any = undefined;

beforeEach(() => {
  userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get');
});

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

  it.each([['desktop'], ['mobile']])('matches snapshot where form factor is %s', async (formFactor: string) => {
    if (formFactor === 'mobile') {
      const mobileSafariUserAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1';
      userAgentGetter.mockReturnValue(mobileSafariUserAgent);
    }

    const component = renderer.create(<Home />).toJSON();
    expect(component).toMatchSnapshot();
  });
});
