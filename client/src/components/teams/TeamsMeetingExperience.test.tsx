// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CallWithChatComposite,
  createAzureCommunicationCallWithChatAdapterFromClients
} from '@azure/communication-react';
import { mount } from 'enzyme';
import { TeamsMeetingExperience, MeetingExperienceProps } from './TeamsMeetingExperience';
import * as GetTeamsMeetingLink from '../../utils/GetMeetingLink';
import {
  createMockCallWithChatAdapter,
  createMockCallWithChatComposite,
  createMockStatefulCallClient,
  createMockStatefulChatClient,
  runFakeTimers
} from '../../utils/TestUtils';
import { PostCallConfig } from '../../models/ConfigModel';
import { Survey } from '../postcall/Survey';

jest.mock('@azure/communication-react', () => {
  return {
    ...jest.requireActual('@azure/communication-react'),
    createAzureCommunicationCallWithChatAdapterFromClients: jest.fn(), //mocking state object callWithChatAdapter
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

describe('TeamsMeetingExperience', () => {
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
    (createAzureCommunicationCallWithChatAdapterFromClients as jest.Mock).mockImplementationOnce(() =>
      createMockCallWithChatAdapter()
    );

    const meetingExperience = await mount<MeetingExperienceProps>(
      <TeamsMeetingExperience
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
    (createAzureCommunicationCallWithChatAdapterFromClients as jest.Mock).mockImplementationOnce(() =>
      createMockCallWithChatAdapter()
    );

    const meetingExperience = await mount<MeetingExperienceProps>(
      <TeamsMeetingExperience
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
    (createAzureCommunicationCallWithChatAdapterFromClients as jest.Mock).mockImplementationOnce(() =>
      createMockCallWithChatAdapter()
    );

    const meetingExperience = await mount<MeetingExperienceProps>(
      <TeamsMeetingExperience
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
    const parentDiv = callWithChatComposites.parent();
    expect(parentDiv.props().style.display).toBe('flex');
  });

  it('should not render Survey component when postcall is undefined', async () => {
    (createAzureCommunicationCallWithChatAdapterFromClients as jest.Mock).mockImplementationOnce(() =>
      createMockCallWithChatAdapter()
    );
    const meetingExperience = await mount<MeetingExperienceProps>(
      <TeamsMeetingExperience
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
        postCall={undefined}
        onDisplayError={jest.fn()}
      />
    );

    await runFakeTimers();
    meetingExperience.update();

    const survey = meetingExperience.find(Survey);
    expect(survey.length).toBe(0);
    const callWithChatComposites = meetingExperience.find(CallWithChatComposite);
    expect(callWithChatComposites.length).toBe(1);
    const parentDiv = callWithChatComposites.parent();
    expect(parentDiv.props().style.display).toBe('flex');
  });

  it('should render Survey component when postcall is defined and valid', async () => {
    const mockedCallWithChatAdapter = createMockCallWithChatAdapter();
    mockedCallWithChatAdapter.on = jest.fn().mockImplementationOnce((_event, handler) => handler('callEnded'));
    (createAzureCommunicationCallWithChatAdapterFromClients as jest.Mock).mockImplementationOnce(
      () => mockedCallWithChatAdapter
    );

    const meetingExperience = await mount<MeetingExperienceProps>(
      <TeamsMeetingExperience
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
    expect(survey.length).toBe(1);
    const callWithChatComposites = meetingExperience.find(CallWithChatComposite);
    expect(callWithChatComposites.length).toBe(1);
    const parentDiv = callWithChatComposites.parent();
    expect(parentDiv.props().style.display).toBe('none');
  });
});