// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatThreadClient } from '@azure/communication-chat';
import { StatefulChatClient } from '@azure/communication-react';

export type IChatClient = PublicInterface<StatefulChatClient>;

export type IChatThreadClient = PublicInterface<ChatThreadClient>;

type PublicInterface<T> = { [K in keyof T]: T[K] };
