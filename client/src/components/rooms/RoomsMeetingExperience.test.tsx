// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  createMockCallAdapter,
  createMockCallComposite,
  createMockStatefulCallClient,
  runFakeTimers
} from '../../utils/TestUtils';
import { mount } from 'enzyme';
import { RoomsMeetingExperience, RoomsMeetingExperienceProps } from './RoomsMeetingExperience';
import { RoomParticipantRole } from '../../models/RoomModel';
import { CallComposite } from '@azure/communication-react';
import { PostCallConfig } from '../../models/ConfigModel';
import { generateTheme } from '../../utils/ThemeGenerator';

jest.mock('@azure/communication-react', () => {
  return {
    ...jest.requireActual('@azure/communication-react'),
    createAzureCommunicationCallAdapterFromClient: () => createMockCallAdapter(),
    createStatefulCallClient: () => createMockStatefulCallClient(),
    CallComposite: () => createMockCallComposite()
  };
});

jest.mock('@azure/communication-common', () => {
  return {
    AzureCommunicationTokenCredential: function () {
      return { token: '', getToken: () => '' };
    }
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('RoomsMeetingExperience', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation();
  });
  const mockPostCall: PostCallConfig = {
    survey: {
      type: 'onequestionpoll',
      options: {
        title: 'mock',
        prompt: 'mock',
        pollType: 'text',
        answerPlaceholder: 'Enter your comments here...',
        saveButtonText: 'Continue'
      }
    }
  };

  it('sets display name as Virtual appointments Host and should have invite url if the participant is a presenter', async () => {
    const roomsMeetingExperience = await mount<RoomsMeetingExperienceProps>(
      <RoomsMeetingExperience
        theme={generateTheme('#FFFFFF')}
        postCall={mockPostCall}
        roomsInfo={{
          userId: 'userId',
          userRole: RoomParticipantRole.presenter,
          locator: { roomId: 'roomId' }
        }}
        token={'token'}
        inviteParticipantUrl={'testUrl'}
        onDisplayError={jest.fn()}
      />
    );

    await runFakeTimers();
    roomsMeetingExperience.update();

    const callComposite = roomsMeetingExperience.find(CallComposite);
    expect(callComposite.length).toBe(1);
    expect(callComposite.first().props().adapter.getState().displayName?.includes('Virtual appointments Host'));
    expect(callComposite.first().props().callInvitationUrl).toBe('testUrl');
  });

  it('sets display name as Virtual appointments Virtual appointments User and should have not have invite url if the participant is a attendee', async () => {
    const roomsMeetingExperience = await mount<RoomsMeetingExperienceProps>(
      <RoomsMeetingExperience
        theme={generateTheme('#FFFFFF')}
        postCall={mockPostCall}
        roomsInfo={{
          userId: 'userId',
          userRole: RoomParticipantRole.presenter,
          locator: { roomId: 'roomId' }
        }}
        token={'token'}
        onDisplayError={jest.fn()}
      />
    );

    await runFakeTimers();
    roomsMeetingExperience.update();

    const callComposite = roomsMeetingExperience.find(CallComposite);
    expect(callComposite.length).toBe(1);
    expect(callComposite.first().props().adapter.getState().displayName?.includes('Virtual appointments User'));
    expect(callComposite.first().props().callInvitationUrl).toBeUndefined;
  });
});
