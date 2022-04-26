// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { setIconOptions } from '@fluentui/react';
import { mount } from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MeetingExperience, MeetingExperienceProps, MeetingExperienceState } from './MeetingExperience';
import {
  AdapterError,
  CallWithChatAdapter,
  CallWithChatAdapterState,
  CallWithChatComposite
} from '@azure/communication-react';

configure({ adapter: new Adapter() });

// Disable icon warnings for tests as we don't register the icons for unit tests which causes warnings.
// See: https://github.com/microsoft/fluentui/wiki/Using-icons#test-scenarios
setIconOptions({
  disableWarnings: true
});

// Inspired by ui-library unit test: https://aka.ms/AAfyg3m
function createMockCallWithChatAdapter(): CallWithChatAdapter {
  const callWithChatAdapter = {} as CallWithChatAdapter;
  callWithChatAdapter.onStateChange = jest.fn();
  callWithChatAdapter.offStateChange = jest.fn();
  callWithChatAdapter.askDevicePermission = jest.fn();
  callWithChatAdapter.queryCameras = jest.fn();
  callWithChatAdapter.queryMicrophones = jest.fn();
  callWithChatAdapter.querySpeakers = jest.fn();
  callWithChatAdapter.on = jest.fn(); // allow for direct subscription to the state of the call-with-chat adapter
  callWithChatAdapter.off = jest.fn(); // Allow for direct un-subscription to the state of the call-with-chat adapter
  callWithChatAdapter.getState = jest.fn(
    (): CallWithChatAdapterState => ({
      page: 'lobby',
      isLocalPreviewMicrophoneEnabled: false,
      userId: { kind: 'communicationUser', communicationUserId: 'test' },
      displayName: 'test',
      devices: {
        isSpeakerSelectionAvailable: false,
        cameras: [],
        microphones: [],
        speakers: [],
        unparentedViews: []
      },
      isTeamsCall: true,
      call: undefined,
      chat: undefined,
      latestCallErrors: { test: new Error() as AdapterError },
      latestChatErrors: { test: new Error() as AdapterError }
    })
  );
  return callWithChatAdapter;
}

jest.mock('@azure/communication-react', () => {
  return {
    ...jest.requireActual('@azure/communication-react'),
    createAzureCommunicationCallWithChatAdapterFromClients: () => {
      return {};
    },
    createStatefulCallClient: () => {
      return { createCallAgent: () => '' };
    },
    createStatefulChatClient: () => {
      return { startRealtimeNotifications: () => '', getChatThreadClient: () => '' };
    },
    CallWithChatComposite: () => {
      return <span>hello</span>;
    }
  };
});

jest.mock('@azure/communication-common', () => {
  return {
    AzureCommunicationTokenCredential: function () {
      return { token: '', getToken: () => '' };
    }
  };
});

describe('MeetingExperience', () => {
  const waitingTitle = 'waiting title';
  const waitingSubtitle = 'waiting subtitle';
  const logoUrl = 'logoUrl';
  let userAgentGetter: any = undefined;
  const mockedCallWithChatAdapter = createMockCallWithChatAdapter();

  beforeEach(() => {
    userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get');
    jest.spyOn(console, 'log').mockImplementation();
  });

  it('should pass props for customizing the lobby experience to the CallWithChatComposite', async () => {
    const meetingExperience = await mount<MeetingExperienceProps, MeetingExperienceState>(
      <MeetingExperience
        userId={{ communicationUserId: 'test' }}
        token={'token'}
        displayName={'name'}
        endpointUrl={'endpoint'}
        locator={{ meetingLink: 'meeting link' }}
        fluentTheme={undefined}
        waitingTitle={waitingTitle}
        waitingSubtitle={waitingSubtitle}
        logoUrl={logoUrl}
        chatEnabled={true}
      />
    );

    meetingExperience.setState({ callWithChatAdapter: mockedCallWithChatAdapter });
    await meetingExperience.update();

    const callWithChatComposites = meetingExperience.find(CallWithChatComposite);

    expect(callWithChatComposites.length).toBe(1);
    expect(callWithChatComposites.first().props().locale?.strings.call.lobbyScreenWaitingToBeAdmittedTitle).toBe(
      waitingTitle
    );
    expect(callWithChatComposites.first().props().locale?.strings.call.lobbyScreenWaitingToBeAdmittedMoreDetails).toBe(
      waitingSubtitle
    );
    expect(callWithChatComposites.first().props().icons?.LobbyScreenConnectingToCall).toBeDefined();
    expect(callWithChatComposites.first().props().icons?.LobbyScreenWaitingToBeAdmitted).toBeDefined();
    expect(callWithChatComposites.first().props().formFactor).toEqual('desktop');
  });

  it('sets the formFactor to mobile in the CallWithChatComposite', async () => {
    const mobileSafariUserAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1';
    userAgentGetter.mockReturnValue(mobileSafariUserAgent);

    const meetingExperience = await mount<MeetingExperienceProps, MeetingExperienceState>(
      <MeetingExperience
        userId={{ communicationUserId: 'test' }}
        token={'token'}
        displayName={'name'}
        endpointUrl={'endpoint'}
        locator={{ meetingLink: 'meeting link' }}
        fluentTheme={undefined}
        waitingTitle={waitingTitle}
        waitingSubtitle={waitingSubtitle}
        logoUrl={logoUrl}
        chatEnabled={true}
      />
    );
    meetingExperience.setState({ callWithChatAdapter: mockedCallWithChatAdapter });
    await meetingExperience.update();

    const callWithChatComposites = meetingExperience.find(CallWithChatComposite);

    expect(callWithChatComposites.length).toBe(1);
    expect(callWithChatComposites.first().props().formFactor).toEqual('mobile');
  });
});
