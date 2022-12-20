// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallCompositePage } from '@azure/communication-react';
import { PostCallConfig } from '../models/ConfigModel';
import { RoomParticipantRole } from '../models/RoomModel';

export const isRoomsPostCallEnabled = (userRole: RoomParticipantRole, postCall?: PostCallConfig): boolean =>
  userRole !== RoomParticipantRole.presenter && postCall?.survey.type !== undefined;

export const isRoomsInviteInstructionsEnabled = (
  userRole: RoomParticipantRole,
  formFactor: string,
  page: CallCompositePage
): boolean => userRole === RoomParticipantRole.presenter && formFactor === 'desktop' && page === 'configuration';
