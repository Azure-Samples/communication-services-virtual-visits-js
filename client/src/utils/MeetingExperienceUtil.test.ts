// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallCompositePage } from '@azure/communication-react';
import { PostCallConfig } from '../models/ConfigModel';
import { RoomParticipantRole } from '../models/RoomModel';
import { isRoomsInviteInstructionsEnabled, isRoomsPostCallEnabled } from './MeetingExperienceUtil';

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

describe('isRoomsPostCallEnabled', () => {
  it.each([[RoomParticipantRole.attendee], [RoomParticipantRole.consumer]])(
    'returns true if user role is %s and postCall is valid',
    (role: RoomParticipantRole) => {
      const result = isRoomsPostCallEnabled(role, mockPostCall);
      expect(result).toBe(true);
    }
  );

  it.each([[RoomParticipantRole.attendee], [RoomParticipantRole.consumer]])(
    'returns false if user role is %s and postCall is undefined',
    (role: RoomParticipantRole) => {
      const result = isRoomsPostCallEnabled(role);
      expect(result).toBe(false);
    }
  );

  it.each([[undefined], [mockPostCall]])('returns false if user role is Presenter', (postCall?: PostCallConfig) => {
    const result = isRoomsPostCallEnabled(RoomParticipantRole.presenter, postCall);
    expect(result).toBe(false);
  });
});

describe('isRoomsInviteInstructionsEnabled', () => {
  it('returns true if user role is Presenter, formFactor is desktop, and CallAdapterPage is configuration', () => {
    const result = isRoomsInviteInstructionsEnabled(
      RoomParticipantRole.presenter,
      'desktop',
      'configuration' as CallCompositePage
    );
    expect(result).toBe(true);
  });
});
