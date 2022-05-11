// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { ChatThreadClient, ChatThreadItem, CreateChatThreadResult } from '@azure/communication-chat';
import { CommunicationIdentifier, CommunicationIdentifierKind, getIdentifierKind } from '@azure/communication-common';
import { ChatClientState, ChatErrors, StatefulChatClient } from '@azure/communication-react';
import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { StubChtThreadClient } from './ChatThreadClient';
import { IChatClient, IChatThreadClient } from './types';
import { pagedAsyncIterator } from './chatUtils';

export function createStubChatClient(userId: CommunicationIdentifier, threadId: string): StatefulChatClient {
  return (new StubChatClient(getIdentifierKind(userId), threadId) as IChatClient) as StatefulChatClient;
}

/**
 * A public interface compatible stub for ChatClient.
 */
export class StubChatClient implements IChatClient {
  private state: ChatClientState;

  constructor(private userId: CommunicationIdentifierKind, private threadId: string) {
    const threads = {};
    threads[threadId] = {
      threadId,
      chatMessages: {},
      participants: {},
      readReceipts: [],
      typingIndicators: [],
      latestReadTime: new Date()
    };
    this.state = { userId: this.userId, displayName: '', threads, latestErrors: {} as ChatErrors };
  }

  //
  // Minimal stubs needed for bootstrapping `CallWithChatComposite`.
  //
  getChatThreadClient(): ChatThreadClient {
    // FakeChatThreadClient only implements the public interface of ChatThreadClient.
    return (new StubChtThreadClient(this.threadId) as IChatThreadClient) as ChatThreadClient;
  }
  listChatThreads(): PagedAsyncIterableIterator<ChatThreadItem> {
    return pagedAsyncIterator([{ id: this.threadId, topic: '' }]);
  }
  getState(): ChatClientState {
    return this.state;
  }
  on(): void {
    /* Stub generates no events. */
  }
  off(): void {
    /* Stub generates no events. */
  }
  onStateChange(): void {
    /* Stub state never changes */
  }
  offStateChange(): void {
    /* Stub state never changes */
  }

  //
  // Throw for all other methods so that we fail fast.
  //
  createChatThread(): Promise<CreateChatThreadResult> {
    throw new Error('Stub: unimplemented');
  }
  deleteChatThread(): Promise<void> {
    throw new Error('Stub: unimplemented');
  }
  startRealtimeNotifications(): Promise<void> {
    return Promise.resolve();
  }
  stopRealtimeNotifications(): Promise<void> {
    return Promise.resolve();
  }
}
