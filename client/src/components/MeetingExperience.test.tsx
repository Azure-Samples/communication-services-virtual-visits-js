// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CallWithChatComposite } from '@azure/communication-react';
import { setIconOptions } from '@fluentui/react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MeetingExperience, MeetingExperienceProps } from './MeetingExperience';
import * as GetTeamsMeetingLink from '../utils/GetTeamsMeetingLink';
import {
  createMockCallWithChatAdapter,
  createMockCallWithChatComposite,
  createMockStatefulCallClient,
  createMockStatefulChatClient,
  runFakeTimers
} from '../utils/TestUtils';
import { PostCallConfig } from '../models/ConfigModel';
import { Survey } from '../components/Survey';
configure({ adapter: new Adapter() });

// Disable icon warnings for tests as we don't register the icons for unit tests which causes warnings.
// See: https://github.com/microsoft/fluentui/wiki/Using-icons#test-scenarios
setIconOptions({
  disableWarnings: true
});

jest.mock('@azure/communication-react', () => {
  return {
    ...jest.requireActual('@azure/communication-react'),
    createAzureCommunicationCallWithChatAdapterFromClients: () => createMockCallWithChatAdapter(),
    createStatefulCallClient: () => createMockStatefulCallClient(),
    createStatefulChatClient: () => createMockStatefulChatClient(),
    CallWithChatComposite: () => createMockCallWithChatComposite()
  };
});

jest.mock('@azure/communication-common', () => {
  return {
    AzureCommunicationTokenCredential: function () {
      return { token: '', getToken: () => '' };
    }
  };
});

const mockPostCall: PostCallConfig = {
  survey: {
    type: 'msforms',
    options: {
      surveyUrl: 'dummySurveyUrl'
    }
  }
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('MeetingExperience', () => {
  const waitingTitle = 'waiting title';
  const waitingSubtitle = 'waiting subtitle';
  const logoUrl = 'logoUrl';
  let userAgentGetter: any = undefined;

  beforeEach(() => {
    userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get');
    jest.spyOn(console, 'error').mockImplementation();
    const getChatThreadIdFromTeamsLinkSpy = jest.spyOn(GetTeamsMeetingLink, 'getChatThreadIdFromTeamsLink');
    getChatThreadIdFromTeamsLinkSpy.mockReturnValue('threadId');
  });

  it('should pass props for customizing the lobby experience to the CallWithChatComposite', async () => {
    const meetingExperience = await mount<MeetingExperienceProps>(
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
        postCall={mockPostCall}
        onDisplayError={jest.fn()}
      />
    );

    await runFakeTimers();
    meetingExperience.update();
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

    const meetingExperience = await mount<MeetingExperienceProps>(
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
        postCall={mockPostCall}
        onDisplayError={jest.fn()}
      />
    );

    await runFakeTimers();
    meetingExperience.update();

    const callWithChatComposites = meetingExperience.find(CallWithChatComposite);

    expect(callWithChatComposites.length).toBe(1);
    expect(callWithChatComposites.first().props().formFactor).toEqual('mobile');
  });

  it('should render CallWithChatComposite when renderPostCall is false', async () => {
    const meetingExperience = await mount<MeetingExperienceProps>(
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
        postCall={mockPostCall}
        onDisplayError={jest.fn()}
      />
    );

    await runFakeTimers();
    meetingExperience.update();

    const survey = meetingExperience.find(Survey);
    const callWithChatComposites = meetingExperience.find(CallWithChatComposite);

    expect(survey.length).toBe(0);
    expect(callWithChatComposites.length).toBe(1);
  });

  it('should render Survey component', async () => {
    const setRenderPostCallMock = jest.fn();
    const useStateMock: any = (_: any) => [true, setRenderPostCallMock];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);

    const meetingExperience = await mount<MeetingExperienceProps>(
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
        postCall={mockPostCall}
        onDisplayError={jest.fn()}
      />
    );

    await runFakeTimers();

    meetingExperience.update();

    const survey = meetingExperience.find(Survey);
    const callWithChatComposites = meetingExperience.find(CallWithChatComposite);
    expect(callWithChatComposites.length).toBe(0);
    expect(survey.length).toBe(1);
    expect(callWithChatComposites.length).toBe(0);
  });
});
