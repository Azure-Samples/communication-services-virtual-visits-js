// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  AddChatParticipantsResult,
  ChatMessage,
  ChatMessageReadReceipt,
  ChatParticipant,
  ChatThreadProperties,
  SendChatMessageResult
} from '@azure/communication-chat';
import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { IChatThreadClient } from './types';
import { pagedAsyncIterator } from './chatUtils';

/**
 * A public interface compatible stub for ChatThreadClient.
 */
export class StubChtThreadClient implements IChatThreadClient {
  private createdOn: Date;
  constructor(public threadId: string) {
    this.createdOn = new Date();
  }

  //
  // Minimal stubs needed for bootstrapping `CallWithChatComposite`.
  //
  getProperties(): Promise<ChatThreadProperties> {
    return Promise.resolve({
      id: this.threadId,
      topic: '',
      createdOn: this.createdOn
    });
  }
  sendMessage(): Promise<SendChatMessageResult> {
    // Message IDs must be time since epoch.
    return Promise.resolve({ id: new Date().getTime().toString() });
  }
  listMessages(): PagedAsyncIterableIterator<ChatMessage> {
    return pagedAsyncIterator([]);
  }
  listParticipants(): PagedAsyncIterableIterator<ChatParticipant> {
    return pagedAsyncIterator([]);
  }
  sendTypingNotification(): Promise<boolean> {
    return Promise.resolve(true);
  }
  sendReadReceipt(): Promise<void> {
    return Promise.resolve();
  }
  listReadReceipts(): PagedAsyncIterableIterator<ChatMessageReadReceipt> {
    return pagedAsyncIterator([]);
  }

  //
  // Throw for all other methods so that we fail fast.
  //
  updateTopic(): Promise<void> {
    throw new Error('Stub: unimplemented');
  }
  getMessage(): Promise<ChatMessage> {
    throw new Error('Stub: unimplemented');
  }
  deleteMessage(): Promise<void> {
    throw new Error('Stub: unimplemented');
  }
  updateMessage(): Promise<void> {
    throw new Error('Stub: unimplemented');
  }
  addParticipants(): Promise<AddChatParticipantsResult> {
    throw new Error('Stub: unimplemented');
  }
  removeParticipant(): Promise<void> {
    throw new Error('Stub: unimplemented');
  }
}
