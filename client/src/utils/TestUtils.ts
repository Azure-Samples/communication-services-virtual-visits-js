// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallAgentKind, DeviceManager } from '@azure/communication-calling';
import {
  AdapterError,
  CallAdapter,
  CallAdapterState,
  CallWithChatAdapter,
  CallWithChatAdapterState,
  DeclarativeCallAgent,
  StatefulCallClient
} from '@azure/communication-react';
import { act } from '@testing-library/react';

export const runFakeTimers = async (): Promise<void> => {
  await act(async () => {
    jest.useFakeTimers();
    jest.runAllTimers();
  });
};

// Inspired by ui-library unit test: https://aka.ms/AAfyg3m
export const createMockCallWithChatAdapter = (): CallWithChatAdapter => {
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
      latestCallNotifications: {},
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
      latestChatErrors: { test: new Error() as AdapterError },
      isTeamsMeeting: false
    })
  );
  return callWithChatAdapter;
};

export const createMockCallAdapter = (): CallAdapter => {
  const callAdapter = {} as CallAdapter;
  callAdapter.onStateChange = jest.fn();
  callAdapter.offStateChange = jest.fn();
  callAdapter.askDevicePermission = jest.fn();
  callAdapter.queryCameras = jest.fn();
  callAdapter.queryMicrophones = jest.fn();
  callAdapter.querySpeakers = jest.fn();
  callAdapter.on = jest.fn(); // allow for direct subscription to the state of the call adapter
  callAdapter.off = jest.fn(); // Allow for direct un-subscription to the state of the call adapter
  callAdapter.getState = jest.fn(
    (): CallAdapterState => ({
      page: 'lobby',
      isLocalPreviewMicrophoneEnabled: false,
      userId: { kind: 'communicationUser', communicationUserId: 'test' },
      displayName: 'test',
      latestNotifications: {},
      call: undefined,
      devices: {
        isSpeakerSelectionAvailable: false,
        cameras: [],
        microphones: [],
        speakers: [],
        unparentedViews: []
      },
      isTeamsCall: false,
      latestErrors: { test: new Error() as AdapterError },
      isTeamsMeeting: false,
      isRoomsCall: false
    })
  );
  return callAdapter;
};

export const createMockStatefulCallClient = (): StatefulCallClient => {
  const statefulClient = {} as StatefulCallClient;

  statefulClient.createCallAgent = jest.fn().mockImplementation(() => Promise.resolve(createMockCallAgent()));
  statefulClient.getState = jest.fn().mockReturnValue({});
  statefulClient.getDeviceManager = jest.fn().mockResolvedValue(({
    askDevicePermission: jest.fn(),
    getCameras: jest.fn(),
    getMicrophones: jest.fn(),
    getSpeakers: jest.fn(),
    getSelectedCamera: jest.fn(),
    getSelectedMicrophone: jest.fn()
  } as unknown) as DeviceManager);
  statefulClient.createTeamsCallAgent = jest.fn();
  statefulClient.feature = jest.fn();
  statefulClient.onStateChange = jest.fn();
  statefulClient.offStateChange = jest.fn();
  statefulClient.createView = jest.fn();
  statefulClient.disposeView = jest.fn();

  return statefulClient;
};

export const createMockCallAgent = (): DeclarativeCallAgent => {
  console.log('Mock Call Agent created');
  return ({
    dispose: jest.fn(),
    calls: [],
    incomingCalls: [],
    startCall: jest.fn(),
    join: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    kind: CallAgentKind.CallAgent,
    connectionState: 'Connected'
  } as unknown) as DeclarativeCallAgent;
};

export const createMockStatefulChatClient = () => {
  return { startRealtimeNotifications: () => '', getChatThreadClient: () => '' };
};

export const createMockCallWithChatComposite = () => {
  return 'hello';
};

export const createMockCallComposite = () => {
  return 'hello';
};
