// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AdapterError, CallWithChatAdapter, CallWithChatAdapterState } from '@azure/communication-react';
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
};

export const createMockStatefulCallClient = () => {
  return { createCallAgent: () => '' };
};

export const createMockStatefulChatClient = () => {
  return { startRealtimeNotifications: () => '', getChatThreadClient: () => '' };
};

export const createMockCallWithChatComposite = () => {
  return 'hello';
};
