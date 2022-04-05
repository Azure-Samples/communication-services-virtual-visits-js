// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { setIconOptions, Spinner } from '@fluentui/react';
import { CommunicationUserToken } from '@azure/communication-identity';
import { mount } from 'enzyme';
import { generateTheme } from './utils/ThemeGenerator';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Visit } from './Visit';
import { AppConfigModel } from './models/ConfigModel';
import { Header } from './Header';
import { act } from '@testing-library/react';
import { fetchConfig } from './utils/FetchConfig';
import { TeamsMeetingLinkModel } from './models/TeamsMeetingLinkModel';

configure({ adapter: new Adapter() });

// Disable icon warnings for tests as we don't register the icons for unit tests which causes warnings.
// See: https://github.com/microsoft/fluentui/wiki/Using-icons#test-scenarios
setIconOptions({
  disableWarnings: true
});

jest.mock('./utils/FetchConfig', () => {
  return {
    fetchConfig: jest.fn()
  };
});

jest.mock('./utils/FetchToken', () => {
  return {
    fetchToken: (): Promise<CommunicationUserToken> => {
      return Promise.resolve({
        user: { communicationUserId: 'userId' },
        token: 'token',
        expiresOn: new Date()
      });
    }
  };
});

jest.mock('./utils/GetTeamsMeetingLink', () => {
  return {
    getTeamsMeetingLink: (): TeamsMeetingLinkModel => {
      return { meetingUrl: 'url' };
    }
  };
});

jest.mock('./components/MeetingExperience');

describe('Visit', () => {
  it('should render loading spinner when config is not loaded', async () => {
    (fetchConfig as jest.Mock).mockImplementation(
      async (): Promise<AppConfigModel | undefined> => {
        return Promise.resolve(undefined);
      }
    );

    const visit = await mount(<Visit />);

    await act(async () => {
      jest.useFakeTimers();
      jest.runAllTimers();
    });

    visit.update();

    const spinners = visit.find(Spinner);
    const headers = visit.find(Header);

    expect(spinners.length).toBe(1);
    expect(headers.length).toBe(0);
  });

  it('renders an generic error UI when config throws an error', async () => {
    (fetchConfig as jest.Mock).mockImplementation(
      async (): Promise<AppConfigModel | undefined> => {
        throw new Error('test error');
      }
    );

    const visit = await mount(<Visit />);

    await act(async () => {
      jest.useFakeTimers();
      jest.runAllTimers();
    });

    visit.update();

    const genericErrorUI = visit.find('#generic-error');

    expect(genericErrorUI.length).toBe(1);
  });

  it('should render header when config is loaded', async () => {
    (fetchConfig as jest.Mock).mockImplementation(
      async (): Promise<AppConfigModel | undefined> => {
        return Promise.resolve({
          communicationEndpoint: 'enpoint=test_endpoint;',
          microsoftBookingsUrl: '',
          chatEnabled: true,
          screenShareEnabled: true,
          companyName: '',
          theme: generateTheme('#FFFFFF'),
          waitingTitle: '',
          waitingSubtitle: '',
          logoUrl: ''
        });
      }
    );

    const visit = await mount(<Visit />);

    await act(async () => {
      jest.useFakeTimers();
      jest.runAllTimers();
    });

    visit.update();

    const spinners = visit.find(Spinner);
    const headers = visit.find(Header);

    expect(spinners.length).toBe(0);
    expect(headers.length).toBe(1);
  });
});
