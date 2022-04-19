// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { LayerHost, PrimaryButton, setIconOptions, Stack, TextField } from '@fluentui/react';
import { mount } from 'enzyme';
import { generateTheme } from '../utils/ThemeGenerator';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JoinTeamsMeeting } from './JoinTeamsMeeting';
import { Header } from '../Header';
import { getTeamsMeetingLink } from '../utils/GetTeamsMeetingLink';
import {
  mainJoinTeamsMeetingContainerMobileStyles,
  mainJoinTeamsMeetingContainerStyles
} from '../styles/JoinTeamsMeeting.Styles';

configure({ adapter: new Adapter() });

// Disable icon warnings for tests as we don't register the icons for unit tests which causes warnings.
// See: https://github.com/microsoft/fluentui/wiki/Using-icons#test-scenarios
setIconOptions({
  disableWarnings: true
});

const validTeamsMeetingLink = getTeamsMeetingLink(
  '?meetingURL=https%3A%2F%2Fteams.microsoft.com%2Fl%2Fmeetup-join%2F19%253ameeting_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2540thread.v2%2F0%3Fcontext%3D%257b%2522Tid%2522%253a%252200000000-0000-0000-0000-000000000000%2522%252c%2522Oid%2522%253a%252200000000-0000-0000-0000-000000000000%2522%257d'
).meetingUrl;

let userAgentGetter: any = undefined;

beforeEach(() => {
  userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get');
});

describe('JoinTeamsMeeting', () => {
  it('should render header when page is loaded', async () => {
    const meeting = mount(
      <JoinTeamsMeeting
        config={{
          communicationEndpoint: 'enpoint=test_endpoint;',
          microsoftBookingsUrl: '',
          chatEnabled: true,
          screenShareEnabled: true,
          companyName: '',
          theme: generateTheme('#FFFFFF'),
          waitingTitle: '',
          waitingSubtitle: '',
          logoUrl: ''
        }}
        onJoinMeeting={jest.fn()}
      />
    );

    const headers = meeting.find(Header);

    expect(headers.length).toBe(1);
  });

  it('join button should be disabled when meeting link does not exist', async () => {
    const meeting = mount(
      <JoinTeamsMeeting
        config={{
          communicationEndpoint: 'enpoint=test_endpoint;',
          microsoftBookingsUrl: '',
          chatEnabled: true,
          screenShareEnabled: true,
          companyName: '',
          theme: generateTheme('#FFFFFF'),
          waitingTitle: '',
          waitingSubtitle: '',
          logoUrl: ''
        }}
        onJoinMeeting={jest.fn()}
      />
    );

    const joinButton = meeting.find(PrimaryButton);
    const buttonState = joinButton.prop('disabled');

    expect(buttonState).toBe(true);
  });

  it('should enable join button when meeting link is added', async () => {
    const meeting = mount(
      <JoinTeamsMeeting
        config={{
          communicationEndpoint: 'enpoint=test_endpoint;',
          microsoftBookingsUrl: '',
          chatEnabled: true,
          screenShareEnabled: true,
          companyName: '',
          theme: generateTheme('#FFFFFF'),
          waitingTitle: '',
          waitingSubtitle: '',
          logoUrl: ''
        }}
        onJoinMeeting={jest.fn()}
      />
    );

    meeting.setState({ teamsMeetingLink: validTeamsMeetingLink });
    const joinButton = meeting.find(PrimaryButton);
    const buttonState = joinButton.prop('disabled');

    expect(buttonState).toBe(false);
  });

  it.each([['desktop'], ['mobile']])('uses correct styles if form factor is %s', async (formFactor: string) => {
    const theme = generateTheme('#FFFFFF');
    let expectedStyles = mainJoinTeamsMeetingContainerStyles(theme);

    if (formFactor === 'mobile') {
      const mobileSafariUserAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1';
      userAgentGetter.mockReturnValue(mobileSafariUserAgent);
      expectedStyles = mainJoinTeamsMeetingContainerMobileStyles(theme);
    }

    const meeting = mount(
      <JoinTeamsMeeting
        config={{
          communicationEndpoint: 'enpoint=test_endpoint;',
          microsoftBookingsUrl: '',
          chatEnabled: true,
          screenShareEnabled: true,
          companyName: 'Lamna Healthcare',
          theme: theme,
          waitingTitle: 'Hello',
          waitingSubtitle: 'World',
          logoUrl: ''
        }}
        onJoinMeeting={jest.fn()}
      />
    );

    const container = meeting.find(LayerHost).find(Stack);
    const styles = container.prop('styles');

    expect(styles).toEqual(expectedStyles);
  });

  it('should call onJoinMeeting prop when join button is clicked', async () => {
    const meeting = mount(
      <JoinTeamsMeeting
        config={{
          communicationEndpoint: 'enpoint=test_endpoint;',
          microsoftBookingsUrl: '',
          chatEnabled: true,
          screenShareEnabled: true,
          companyName: '',
          theme: generateTheme('#FFFFFF'),
          waitingTitle: '',
          waitingSubtitle: '',
          logoUrl: ''
        }}
        onJoinMeeting={jest.fn()}
      />
    );

    meeting.setState({ teamsMeetingLink: validTeamsMeetingLink });
    const joinButton = meeting.find(PrimaryButton);

    joinButton.simulate('click');

    expect(meeting.props().onJoinMeeting).toBeCalled();
  });
});

describe('Error handling', () => {
  // FluentUI's TextField doesn't immediatelly call onGetErrorMessage when the value changes.
  // Instead it is called on a timer.
  // So we need fake timers to wait in the test until the callback does get called.
  // https://github.com/microsoft/fluentui/discussions/16240#discussioncomment-217231
  beforeEach(() => {
    // Use modern timers, otherwise jest.runAllTimers() later in the test might fail due to the
    // Lodash's debounce usage in TextField
    // https://github.com/facebook/jest/issues/3465#issuecomment-623393230
    jest.useFakeTimers('modern');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const errorMessage = 'This meeting link is invalid. Verify your meeting link URL.';

  it('must show error message when meeting link is invalid', async () => {
    const meeting = mount(
      <JoinTeamsMeeting
        config={{
          communicationEndpoint: 'enpoint=test_endpoint;',
          microsoftBookingsUrl: '',
          chatEnabled: true,
          screenShareEnabled: true,
          companyName: '',
          theme: generateTheme('#FFFFFF'),
          waitingTitle: '',
          waitingSubtitle: '',
          logoUrl: ''
        }}
        onJoinMeeting={jest.fn()}
      />
    );

    const textField = meeting.find(TextField).find('input');
    textField.simulate('change', { target: { value: 'bad meeting link' } });
    jest.runAllTimers();
    const allText = meeting.text();
    expect(allText).toContain(errorMessage);
  });

  it('must not show error message when meeting link is valid', async () => {
    const meeting = mount(
      <JoinTeamsMeeting
        config={{
          communicationEndpoint: 'enpoint=test_endpoint;',
          microsoftBookingsUrl: '',
          chatEnabled: true,
          screenShareEnabled: true,
          companyName: '',
          theme: generateTheme('#FFFFFF'),
          waitingTitle: '',
          waitingSubtitle: '',
          logoUrl: ''
        }}
        onJoinMeeting={jest.fn()}
      />
    );

    const textField = meeting.find(TextField).find('input');
    textField.simulate('change', { target: { value: validTeamsMeetingLink } });
    jest.runAllTimers();
    const allText = meeting.text();
    expect(allText).not.toContain(errorMessage);
  });
});
