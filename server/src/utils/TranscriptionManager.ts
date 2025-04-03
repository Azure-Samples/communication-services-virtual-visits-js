// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TranscriptionData, TranscriptionMetadata } from '@azure/communication-call-automation';
import { CallTranscription } from './callAutomationUtils';

export class TranscriptionManager {
  /**
   * Used to store the transcription data for each call
   *
   * This is keyed off the correlationId from the transcription service and contains the metadata and data
   */
  private TRANSCRIPTION_STORE: Map<string, CallTranscription>;
  /**
   * Used to map between the call connection id and the correlation id from both transcription and
   * call automation events. This is keyed off the callConnectionId
   */
  private CALLCONNECTION_ID_TO_CORRELATION_ID: Map<string, { correlationId?: string; serverCallId: string }>;

  /**
   * Used to store the remote participants in the call
   * This object is keyed off the callId and contains the communicationUserId and displayName of the remote participants
   *
   * Keeps track of all participants who have ever joined the call so we can show their display name in the transcription and summary.
   */
  private participantsInCallMap: Map<string, Array<{ communicationUserId: string; displayName: string }>>;

  constructor() {
    this.TRANSCRIPTION_STORE = new Map<string, CallTranscription>();
    this.CALLCONNECTION_ID_TO_CORRELATION_ID = new Map<string, { correlationId?: string; serverCallId: string }>();
    this.participantsInCallMap = new Map<string, Array<{ communicationUserId: string; displayName: string }>>();
  }

  public hasTranscriptions(serverCallid: string): boolean {
    const connectionId = Object.keys(this.CALLCONNECTION_ID_TO_CORRELATION_ID).find((key) =>
      this.CALLCONNECTION_ID_TO_CORRELATION_ID[key].serverCallId.includes(serverCallid)
    );
    if (!connectionId) {
      return false;
    }
    return this.TRANSCRIPTION_STORE.has(this.CALLCONNECTION_ID_TO_CORRELATION_ID[connectionId].correlationId);
  }

  public getTranscriptionData(serverCallId: string): CallTranscription | undefined {
    const connectionId = Object.keys(this.CALLCONNECTION_ID_TO_CORRELATION_ID).find((key) =>
      this.CALLCONNECTION_ID_TO_CORRELATION_ID[key].serverCallId.includes(serverCallId)
    );
    if (!connectionId) {
      return undefined;
    }
    const correlationId = this.CALLCONNECTION_ID_TO_CORRELATION_ID[connectionId]?.correlationId;
    if (!correlationId) {
      return undefined;
    }
    return this.TRANSCRIPTION_STORE.get(correlationId);
  }

  public storeTranscriptionMetaData(data: TranscriptionMetadata): void {
    const { correlationId } = data;
    if (!correlationId) {
      console.error('No correlation id found in transcription data');
      return;
    }
    if (!this.TRANSCRIPTION_STORE.has(correlationId)) {
      this.TRANSCRIPTION_STORE.set(correlationId, { metadata: data, data: [] });
    }

    this.CALLCONNECTION_ID_TO_CORRELATION_ID.set(data.callConnectionId, {
      correlationId: correlationId,
      serverCallId: this.CALLCONNECTION_ID_TO_CORRELATION_ID.get(data.callConnectionId)?.serverCallId ?? ''
    });
  }

  public storeTranscriptionData(data: TranscriptionData, eventId: string): void {
    if (!eventId) {
      console.error('No correlation id found in transcription data');
      return;
    }
    if (!this.TRANSCRIPTION_STORE.has(eventId)) {
      console.error('No transcription data found for event id:', eventId);
      return;
    }
    this.TRANSCRIPTION_STORE.get(eventId)?.data.push(data);
  }

  public storeParticipantsInCall(
    serverCallId: string,
    participants: Array<{ communicationUserId: string; displayName: string }>
  ): void {
    this.participantsInCallMap.set(serverCallId, participants);
  }
}
