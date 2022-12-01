// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as FetchToken from '../../utils/FetchToken';
import * as GetMeetingLink from '../../utils/GetMeetingLink';
import { CommunicationUserToken } from '@azure/communication-identity';
import { mount } from 'enzyme';
import { TeamsMeeting } from './TeamsMeeting';
import { generateTheme } from '../../utils/ThemeGenerator';
import {
  createMockCallWithChatAdapter,
  createMockCallWithChatComposite,
  createMockStatefulCallClient,
  createMockStatefulChatClient,
  runFakeTimers
} from '../../utils/TestUtils';
import { Spinner } from '@fluentui/react';
import { TeamsMeetingExperience } from './TeamsMeetingExperience';
import { TeamsMeetingLinkLocator } from '@azure/communication-calling';

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

describe('TeamsMeeting', () => {
  const mockConfig = {
    communicationEndpoint: 'endpoint=test_endpoint;',
    microsoftBookingsUrl: '',
    chatEnabled: true,
    screenShareEnabled: true,
    companyName: '',
    theme: generateTheme('#FFFFFF'),
    waitingTitle: '',
    waitingSubtitle: '',
    logoUrl: ''
  };

  const mockTeamsMeetingLinkLocator = {
    meetingLink:
      '?meetingURL=https%3A%2F%2Fteams.microsoft.com%2Fl%2Fmeetup-join%2F19%253ameeting_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2540thread.v2%2F0%3Fcontext%3D%257b%2522Tid%2522%253a%252200000000-0000-0000-0000-000000000000%2522%252c%2522Oid%2522%253a%252200000000-0000-0000-0000-000000000000%2522%257d'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.spyOn(console, 'error').mockImplementation();

    const getChatThreadIdFromTeamsLinkSpy = jest.spyOn(GetMeetingLink, 'getChatThreadIdFromTeamsLink');
    getChatThreadIdFromTeamsLinkSpy.mockReturnValue('threadId');

    const getTeamsMeetingLink = jest.spyOn(GetMeetingLink, 'getTeamsMeetingLink');
    getTeamsMeetingLink.mockImplementation(() => {
      return {
        meetingLink:
          '?meetingURL=https%3A%2F%2Fteams.microsoft.com%2Fl%2Fmeetup-join%2F19%253ameeting_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2540thread.v2%2F0%3Fcontext%3D%257b%2522Tid%2522%253a%252200000000-0000-0000-0000-000000000000%2522%252c%2522Oid%2522%253a%252200000000-0000-0000-0000-000000000000%2522%257d'
      } as TeamsMeetingLinkLocator;
    });

    const fetchTokenSpy = jest.spyOn(FetchToken, 'fetchToken');

    fetchTokenSpy.mockReturnValue(
      Promise.resolve({
        user: { communicationUserId: 'userId' },
        token: 'token',
        expiresOn: new Date()
      } as CommunicationUserToken)
    );
  });

  it('should call onDisplayError callback if unable to fetch token', async () => {
    const fetchTokenSpy = jest.spyOn(FetchToken, 'fetchToken');
    fetchTokenSpy.mockImplementation(
      async (): Promise<CommunicationUserToken> => {
        throw new Error('test error');
      }
    );

    const teamsMeeting = mount(
      <TeamsMeeting config={mockConfig} locator={mockTeamsMeetingLinkLocator} onDisplayError={jest.fn()} />
    );

    await runFakeTimers();

    teamsMeeting.update();
    expect(teamsMeeting.props().onDisplayError).toHaveBeenCalled();
  });

  it('should render loading spinner when token is not loaded', async () => {
    const fetchTokenSpy = jest.spyOn(FetchToken, 'fetchToken');
    fetchTokenSpy.mockReturnValue(Promise.resolve(undefined));

    const teamsMeeting = mount(
      <TeamsMeeting config={mockConfig} locator={mockTeamsMeetingLinkLocator} onDisplayError={jest.fn()} />
    );

    await runFakeTimers();

    teamsMeeting.update();

    const spinners = teamsMeeting.find(Spinner);
    const teamsMeetingExperience = teamsMeeting.find(TeamsMeetingExperience);

    expect(spinners.length).toBe(1);
    expect(teamsMeetingExperience.length).toBe(0);
  });

  it('should load TeamsMeetingExperience when token is loaded', async () => {
    const teamsMeeting = mount(
      <TeamsMeeting config={mockConfig} locator={mockTeamsMeetingLinkLocator} onDisplayError={jest.fn()} />
    );

    await runFakeTimers();

    teamsMeeting.update();

    const spinners = teamsMeeting.find(Spinner);
    const teamsMeetingExperience = teamsMeeting.find(TeamsMeetingExperience);

    expect(spinners.length).toBe(0);
    expect(teamsMeetingExperience.length).toBe(1);
  });
});
