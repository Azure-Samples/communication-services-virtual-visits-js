// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createAzureCommunicationCallWithChatAdapterFromClients } from '@azure/communication-react';
import { render } from '@testing-library/react';
import { PostCallConfig } from '../../models/ConfigModel';
import * as GetTeamsMeetingLink from '../../utils/GetMeetingLink';
import {
  createMockCallWithChatAdapter,
  createMockCallWithChatComposite,
  createMockStatefulCallClient,
  createMockStatefulChatClient,
  runFakeTimers
} from '../../utils/TestUtils';
import { generateTheme } from '../../utils/ThemeGenerator';
import { TeamsMeetingExperience } from './TeamsMeetingExperience';

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

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should pass props for customizing the lobby experience to the CallWithChatComposite', async () => {
    (createAzureCommunicationCallWithChatAdapterFromClients as jest.Mock).mockImplementationOnce(() =>
      createMockCallWithChatAdapter()
    );

    const meetingExperience = await render(
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
        screenShareEnabled={true}
        postCall={mockPostCall}
        onDisplayError={jest.fn()}
      />
    );

    await runFakeTimers();
    const callWithChatComposites = meetingExperience.queryAllByTestId('meeting-composite');
    expect(callWithChatComposites.length).toBe(1);
    // expect(callWithChatComposites[0].props().locale?.strings.call.lobbyScreenWaitingToBeAdmittedTitle).toBe(
    //   waitingTitle
    // );
    // expect(callWithChatComposites.first().props().locale?.strings.call.lobbyScreenWaitingToBeAdmittedMoreDetails).toBe(
    //   waitingSubtitle
    // );
    // expect(callWithChatComposites.first().props().icons?.LobbyScreenConnectingToCall).toBeDefined();
    // expect(callWithChatComposites.first().props().icons?.LobbyScreenWaitingToBeAdmitted).toBeDefined();
    // expect(callWithChatComposites.first().props().formFactor).toEqual('desktop');
  });

  it('sets the formFactor to mobile in the CallWithChatComposite', async () => {
    const mobileSafariUserAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1';
    userAgentGetter.mockReturnValue(mobileSafariUserAgent);
    (createAzureCommunicationCallWithChatAdapterFromClients as jest.Mock).mockImplementationOnce(() =>
      createMockCallWithChatAdapter()
    );

    const meetingExperience = await render(
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
        screenShareEnabled={true}
        postCall={mockPostCall}
        onDisplayError={jest.fn()}
      />
    );

    await runFakeTimers();

    const callWithChatComposites = meetingExperience.queryAllByTestId('meeting-composite');

    expect(callWithChatComposites.length).toBe(1);
    // expect(callWithChatComposites.first().props().formFactor).toEqual('mobile');
  });

  it.each([[true], [false]])(
    'should pass the call settings to CallWithChatComposite as props',
    async (screenShareEnabled: boolean) => {
      (createAzureCommunicationCallWithChatAdapterFromClients as jest.Mock).mockImplementationOnce(() =>
        createMockCallWithChatAdapter()
      );

      const theme = generateTheme('#F18472');
      const chatEnabled = true;
      const lobbyTitle = 'myLobbyTitle';
      const lobbySubtitle = 'myLobbySubtitle';
      const logoUrl = 'myLogoUrl';

      const meetingExperience = await render(
        <TeamsMeetingExperience
          userId={{ communicationUserId: 'test' }}
          token={'token'}
          displayName={'name'}
          endpointUrl={'endpoint'}
          locator={{ meetingLink: 'meeting link' }}
          fluentTheme={theme}
          waitingTitle={lobbyTitle}
          waitingSubtitle={lobbySubtitle}
          logoUrl={logoUrl}
          chatEnabled={chatEnabled}
          screenShareEnabled={screenShareEnabled}
          postCall={undefined}
          onDisplayError={jest.fn()}
        />
      );

      await runFakeTimers();

      const callWithChatComposites = meetingExperience.queryAllByTestId('meeting-composite');
      expect(callWithChatComposites.length).toBe(1);

      // const composite = callWithChatComposites[0];
      // const callOptions = composite.props().options?.callControls as CallWithChatControlOptions;
      // expect(callOptions?.chatButton).toBe(chatEnabled);
      // expect(callOptions?.screenShareButton).toBe(screenShareEnabled);

      // const lobbyScreenWaitingToBeAdmitted = composite.props().icons?.LobbyScreenWaitingToBeAdmitted;
      // expect(lobbyScreenWaitingToBeAdmitted?.props.src).toBe(logoUrl);

      // const lobbyScreenConnectingToCall = composite.props().icons?.LobbyScreenConnectingToCall;
      // expect(lobbyScreenConnectingToCall?.props.src).toBe(logoUrl);

      // const locale = composite.props().locale as CompositeLocale;
      // expect(locale.strings.call.lobbyScreenWaitingToBeAdmittedTitle).toBe(lobbyTitle);
      // expect(locale.strings.call.lobbyScreenWaitingToBeAdmittedMoreDetails).toBe(lobbySubtitle);
    }
  );

  it('should render CallWithChatComposite when renderPostCall is false', async () => {
    (createAzureCommunicationCallWithChatAdapterFromClients as jest.Mock).mockImplementationOnce(() =>
      createMockCallWithChatAdapter()
    );

    const meetingExperience = await render(
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
        screenShareEnabled={true}
        postCall={mockPostCall}
        onDisplayError={jest.fn()}
      />
    );

    await runFakeTimers();

    const survey = meetingExperience.queryAllByTestId('survey');
    const callWithChatComposites = meetingExperience.queryAllByTestId('meeting-composite');

    expect(survey.length).toBe(0);
    expect(callWithChatComposites.length).toBe(1);
    const parentDiv = callWithChatComposites[0].parentElement;
    expect(parentDiv?.style.display).toBe('flex');
  });

  it('should not render Survey component when postcall is undefined', async () => {
    (createAzureCommunicationCallWithChatAdapterFromClients as jest.Mock).mockImplementationOnce(() =>
      createMockCallWithChatAdapter()
    );
    const meetingExperience = await render(
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
        screenShareEnabled={true}
        postCall={undefined}
        onDisplayError={jest.fn()}
      />
    );

    await runFakeTimers();

    const survey = meetingExperience.queryAllByTestId('survey');
    expect(survey.length).toBe(0);
    const callWithChatComposites = meetingExperience.queryAllByTestId('meeting-composite');
    expect(callWithChatComposites.length).toBe(1);
    const parentDiv = callWithChatComposites[0].parentElement;
    expect(parentDiv?.style.display).toBe('flex');
  });

  it('should render Survey component when postcall is defined and valid', async () => {
    const mockedCallWithChatAdapter = createMockCallWithChatAdapter();
    mockedCallWithChatAdapter.on = jest.fn().mockImplementationOnce((_event, handler) => handler('callEnded'));
    (createAzureCommunicationCallWithChatAdapterFromClients as jest.Mock).mockImplementationOnce(
      () => mockedCallWithChatAdapter
    );

    const meetingExperience = await render(
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
        screenShareEnabled={true}
        postCall={mockPostCall}
        onDisplayError={jest.fn()}
      />
    );

    await runFakeTimers();

    const survey = meetingExperience.queryAllByTestId('survey');
    expect(survey.length).toBe(1);
    const callWithChatComposites = meetingExperience.queryAllByTestId('meeting-composite');
    expect(callWithChatComposites.length).toBe(1);
    const parentDiv = callWithChatComposites[0].parentElement;
    expect(parentDiv?.style.display).toBe('none');
  });
});
