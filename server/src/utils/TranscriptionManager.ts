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
  private transcriptionStore: Map<string, CallTranscription>;
  /**
   * Used to map between the serverCallId and the correlation id from both transcription and
   * call automation events. This is keyed off the callConnectionId
   */
  private callConnectionIdToCorrelationId: Map<string, { correlationId?: string; serverCallId: string }>;

  /**
   * Used to store the remote participants in the call
   * This object is keyed off the callId and contains the communicationUserId and displayName of the remote participants
   *
   * Keeps track of all participants who have ever joined the call so we can show their display name in the transcription and summary.
   */
  private participantsInCallMap: Map<string, Array<{ communicationUserId: string; displayName: string }>>;

  constructor() {
    this.transcriptionStore = new Map<string, CallTranscription>();
    this.callConnectionIdToCorrelationId = new Map<string, { correlationId?: string; serverCallId: string }>();
    this.participantsInCallMap = new Map<string, Array<{ communicationUserId: string; displayName: string }>>();
  }

  public hasTranscriptions(serverCallId: string): boolean {
    const connectionId = this.getCallConnectionIDFromServerCallId(serverCallId);
    console.log('Connection ID:', connectionId);
    if (!connectionId) {
      return false;
    }
    const correlationId = this.callConnectionIdToCorrelationId.get(connectionId)?.correlationId;
    return !!correlationId;
  }

  public getTranscriptionData(serverCallId: string): CallTranscription | undefined {
    const connectionId = this.getCallConnectionIDFromServerCallId(serverCallId);
    if (!connectionId) {
      return undefined;
    }
    const correlationId = this.callConnectionIdToCorrelationId.get(connectionId)?.correlationId;
    if (!correlationId) {
      return undefined;
    }
    return this.transcriptionStore.get(correlationId);
  }

  public storeTranscriptionMetaData(data: TranscriptionMetadata): void {
    const { correlationId } = data;
    if (!correlationId) {
      console.error('No correlation id found in transcription data');
      return;
    }
    if (!this.transcriptionStore.has(correlationId)) {
      this.transcriptionStore.set(correlationId, { metadata: data, data: [] });
    }
    this.updateCallConnectionCorrelationId(data.callConnectionId, correlationId);
  }

  public storeTranscriptionData(data: TranscriptionData, eventId: string): void {
    if (!eventId) {
      console.error('No correlation id found in transcription data');
      return;
    }
    if (!this.transcriptionStore.has(eventId)) {
      console.error('No transcription data found for event id:', eventId);
      return;
    }
    this.transcriptionStore.get(eventId)?.data.push(data);
  }

  public storeParticipantsInCall(
    serverCallId: string,
    participants: Array<{ communicationUserId: string; displayName: string }>
  ): void {
    this.participantsInCallMap.set(serverCallId, participants);
  }

  public getCallConnectionIDFromServerCallId(serverCallId: string): string | undefined {
    let callConnectionId: string | undefined;
    for (const [key, value] of this.callConnectionIdToCorrelationId.entries()) {
      if (value.serverCallId.includes(serverCallId)) {
        callConnectionId = key;
        break;
      }
    }
    return callConnectionId;
  }

  public getCallConnection(callConnectionId: string): { correlationId?: string; serverCallId: string } | undefined {
    return this.callConnectionIdToCorrelationId.get(callConnectionId);
  }

  public setCallConnection(callConnectionId: string, serverCallId: string, correlationId?: string): void {
    this.callConnectionIdToCorrelationId.set(callConnectionId, {
      correlationId: correlationId,
      serverCallId: serverCallId
    });
  }

  public updateCallConnectionCorrelationId(callConnectionId: string, correlationId: string): void {
    const callConnection = this.callConnectionIdToCorrelationId.get(callConnectionId);
    if (callConnection) {
      callConnection.correlationId = correlationId;
    }
  }

  public updateCallConnectionServerCallId(callConnectionId: string, serverCallId: string): void {
    const callConnection = this.callConnectionIdToCorrelationId.get(callConnectionId);
    if (callConnection) {
      callConnection.serverCallId = serverCallId;
    }
  }
}
