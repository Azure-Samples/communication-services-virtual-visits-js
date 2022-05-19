// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationUserToken } from '@azure/communication-identity';
import { setIconOptions, Spinner } from '@fluentui/react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Header } from './Header';
import { Visit } from './Visit';
import { GenericError } from './components/GenericError';
import { JoinTeamsMeeting } from './components/JoinTeamsMeeting';
import { AppConfigModel } from './models/ConfigModel';
import * as FetchConfig from './utils/FetchConfig';
import * as FetchToken from './utils/FetchToken';
// import * as GetTeamsMeetingLink from './utils/GetTeamsMeetingLink';
import { runFakeTimers } from './utils/TestUtils';
import { generateTheme } from './utils/ThemeGenerator';
// import { TeamsMeetingLinkLocator } from '@azure/communication-calling';
// import { MeetingExperience } from './components/MeetingExperience';

configure({ adapter: new Adapter() });

// Disable icon warnings for tests as we don't register the icons for unit tests which causes warnings.
// See: https://github.com/microsoft/fluentui/wiki/Using-icons#test-scenarios
setIconOptions({
  disableWarnings: true
});

describe('Visit', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation();

    const fetchTokenSpy = jest.spyOn(FetchToken, 'fetchToken');
    fetchTokenSpy.mockReturnValue(
      Promise.resolve({
        user: { communicationUserId: 'userId' },
        token: 'token',
        expiresOn: new Date()
      } as CommunicationUserToken)
    );
  });

  it('should render loading spinner when config is not loaded', async () => {
    const fetchConfigSpy = jest.spyOn(FetchConfig, 'fetchConfig');
    fetchConfigSpy.mockReturnValue(Promise.resolve(undefined));

    const visit = await mount(<Visit />);

    await runFakeTimers();

    visit.update();

    const spinners = visit.find(Spinner);
    const headers = visit.find(Header);

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

    const visit = await mount(<Visit />);

    await runFakeTimers();

    visit.update();

    const spinners = visit.find(Spinner);
    const genericErrors = visit.find(GenericError);

    expect(spinners.length).toBe(0);
    expect(genericErrors.length).toBe(1);
  });

  it('renders a generic error when token throws an error', async () => {
    const fetchTokenSpy = jest.spyOn(FetchToken, 'fetchToken');
    fetchTokenSpy.mockImplementation(
      async (): Promise<CommunicationUserToken> => {
        throw new Error('test error');
      }
    );

    const visit = await mount(<Visit />);

    await runFakeTimers();

    visit.update();

    const spinners = visit.find(Spinner);
    const genericErrors = visit.find(GenericError);

    expect(spinners.length).toBe(0);
    expect(genericErrors.length).toBe(1);
  });

  it('should render JoinTeamsMeeting when config and token are loaded and meeting link is not set', async () => {
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

    const visit = await mount(<Visit />);

    await runFakeTimers();

    visit.update();

    const spinners = visit.find(Spinner);
    const joinMeetings = visit.find(JoinTeamsMeeting);

    expect(spinners.length).toBe(0);
    expect(joinMeetings.length).toBe(1);
  });

  /* it('should render JoinTeamsMeeting when config and token are loaded and meeting link is set', async () => {
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

    const getTeamsMeetingLinkSpy = jest.spyOn(GetTeamsMeetingLink, 'getTeamsMeetingLink');
    getTeamsMeetingLinkSpy.mockReturnValue({ meetingLink: 'url' } as TeamsMeetingLinkLocator);

    const visit = await mount(<Visit />);
    visit.setState({ meetingLinkLocator: 'url' });

    await runFakeTimers();

    visit.update();

    const spinners = visit.find(Spinner);
    const meetingExperiences = visit.find(MeetingExperience);
    // //On click of primary button is where the join meeting is called and the meeting url is set
    // const primaryButton = visit.find(PrimaryButton).first().find('button');
    // primaryButton.simulate('click');

    expect(spinners.length).toBe(0);
    expect(meetingExperiences.length).toBe(1);
  });*/
});
