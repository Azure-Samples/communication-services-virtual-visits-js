// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  createMockCallAdapter,
  createMockCallComposite,
  createMockStatefulCallClient,
  runFakeTimers
} from '../../utils/TestUtils';
import { mount } from 'enzyme';
import RoomsMeetingExperience, { RoomsMeetingExperienceProps } from './RoomsMeetingExperience';
import { RoomParticipantRole } from '../../models/RoomModel';
import { CallComposite, createAzureCommunicationCallAdapterFromClient } from '@azure/communication-react';
import { PostCallConfig } from '../../models/ConfigModel';
import { generateTheme } from '../../utils/ThemeGenerator';
import { Survey } from '../postcall/Survey';
import * as MeetingExperienceUtil from '../../utils/MeetingExperienceUtil';
import InviteInstructions from './InviteInstructions';

jest.mock('@azure/communication-react', () => {
  return {
    ...jest.requireActual('@azure/communication-react'),
    createAzureCommunicationCallAdapterFromClient: jest.fn(),
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
    (createAzureCommunicationCallAdapterFromClient as jest.Mock).mockImplementationOnce(() => createMockCallAdapter());

    const roomsMeetingExperience = await mount<RoomsMeetingExperienceProps>(
      <RoomsMeetingExperience
        fluentTheme={generateTheme('#FFFFFF')}
        postCall={mockPostCall}
        roomsInfo={{
          userId: 'userId',
          userRole: RoomParticipantRole.presenter,
          locator: { roomId: 'roomId' },
          inviteParticipantUrl: 'testUrl'
        }}
        token={'token'}
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

  it('sets display name as Virtual appointments User and should not have invite url if the participant is a attendee', async () => {
    (createAzureCommunicationCallAdapterFromClient as jest.Mock).mockImplementationOnce(() => createMockCallAdapter());
    const roomsMeetingExperience = await mount<RoomsMeetingExperienceProps>(
      <RoomsMeetingExperience
        fluentTheme={generateTheme('#FFFFFF')}
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
    expect(callComposite.first().props().callInvitationUrl).toBeUndefined();
  });

  it('should render Survey component when postcall is defined and valid and user is attendee', async () => {
    const mockedAdapter = createMockCallAdapter();
    mockedAdapter.on = jest.fn().mockImplementationOnce((_event, handler) => handler('callEnded'));
    (createAzureCommunicationCallAdapterFromClient as jest.Mock).mockImplementationOnce(() => mockedAdapter);

    const roomsMeetingExperience = await mount<RoomsMeetingExperienceProps>(
      <RoomsMeetingExperience
        fluentTheme={generateTheme('#FFFFFF')}
        postCall={mockPostCall}
        roomsInfo={{
          userId: 'userId',
          userRole: RoomParticipantRole.attendee,
          locator: { roomId: 'roomId' }
        }}
        token={'token'}
        onDisplayError={jest.fn()}
      />
    );

    await runFakeTimers();
    roomsMeetingExperience.update();
    const callComposites = roomsMeetingExperience.find(CallComposite);
    expect(callComposites.length).toBe(0);
    const survey = roomsMeetingExperience.find(Survey);
    expect(survey.length).toBe(1);
  });

  it('should not render Survey component when postcall is defined and valid and user is presenter', async () => {
    const mockedAdapter = createMockCallAdapter();
    mockedAdapter.on = jest.fn().mockImplementationOnce((_event, handler) => handler('callEnded'));
    (createAzureCommunicationCallAdapterFromClient as jest.Mock).mockImplementationOnce(() => mockedAdapter);

    const roomsMeetingExperience = await mount<RoomsMeetingExperienceProps>(
      <RoomsMeetingExperience
        fluentTheme={generateTheme('#FFFFFF')}
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
    const callComposites = roomsMeetingExperience.find(CallComposite);
    expect(callComposites.length).toBe(1);
    const survey = roomsMeetingExperience.find(Survey);
    expect(survey.length).toBe(0);
  });

  it.each([[true], [false]])(
    'should render CallComposite component when postcall is undefined',
    async (renderInviteInstructions: boolean) => {
      const mockedAdapter = createMockCallAdapter();
      mockedAdapter.on = jest.fn().mockImplementationOnce((_event, handler) => handler('callEnded'));
      (createAzureCommunicationCallAdapterFromClient as jest.Mock).mockImplementationOnce(() => mockedAdapter);

      jest
        .spyOn(MeetingExperienceUtil, 'isRoomsInviteInstructionsEnabled')
        .mockImplementationOnce(() => renderInviteInstructions);

      const roomsMeetingExperience = mount<RoomsMeetingExperienceProps>(
        <RoomsMeetingExperience
          fluentTheme={generateTheme('#FFFFFF')}
          postCall={undefined}
          roomsInfo={{
            userId: 'userId',
            userRole: RoomParticipantRole.attendee,
            locator: { roomId: 'roomId' }
          }}
          token={'token'}
          onDisplayError={jest.fn()}
        />
      );

      await runFakeTimers();
      roomsMeetingExperience.update();

      const callComposites = roomsMeetingExperience.find(CallComposite);
      expect(callComposites.length).toBe(1);

      const survey = roomsMeetingExperience.find(Survey);
      expect(survey.length).toBe(0);

      const inviteInstructions = roomsMeetingExperience.find(InviteInstructions);

      if (renderInviteInstructions) {
        expect(inviteInstructions.length).toBe(1);
      } else {
        expect(inviteInstructions.length).toBe(0);
      }
    }
  );
});
