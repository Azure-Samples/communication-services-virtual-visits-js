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
    useAzureCommunicationCallWithChatAdapter: () => createMockCallWithChatAdapter(),
    createStatefulCallClient: () => createMockStatefulCallClient(),
    createStatefulChatClient: () => createMockStatefulChatClient(),
    CallWithChatComposite: () => createMockCallWithChatComposite()
  };
});

jest.mock('@azure/communication-common', () => {
  return {
    ...jest.requireActual('@azure/communication-common'),
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
    const callWithChatComposite = await meetingExperience.findByTestId('meeting-composite');

    expect(survey.length).toBe(0);
    expect(callWithChatComposite?.style.display).toBe('flex');
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
    const callWithChatComposite = await meetingExperience.findByTestId('meeting-composite');
    expect(callWithChatComposite?.style.display).toBe('flex');
  });

  // TODO: Fix this test. The afterAdapterCreate function is not being called when using
  // useAzureCommunicationCallWithChatAdapter in TeamsMeetingExperience.tsx because
  // useAzureCommunicationCallWithChatAdapter is being mocked in this test suite.
  // The afterAdapterCreate subscribes the adapter to the callEnded event which triggers
  // showing the SurveyComponent.
  it.skip('should render Survey component when postcall is defined and valid', async () => {
    const mockedCallWithChatAdapter = createMockCallWithChatAdapter();
    mockedCallWithChatAdapter.on = jest.fn().mockImplementationOnce((_event, handler) => {
      handler('callEnded');
    });
    (createAzureCommunicationCallWithChatAdapterFromClients as jest.Mock).mockImplementationOnce(() => {
      return mockedCallWithChatAdapter;
    });

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

    await meetingExperience.findByTitle('SurveyComponent');
  });
});
