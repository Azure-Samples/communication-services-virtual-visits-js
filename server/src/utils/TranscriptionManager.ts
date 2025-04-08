// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TranscriptionData, TranscriptionMetadata } from '@azure/communication-call-automation';
import { CallTranscription } from './callAutomationUtils';

/**
 * Used to store the transcription data for each call
 *
 * This is keyed off the CallConnectionId from the call automation service.
 */
type CallConnectionMapping = Map<string, { correlationId?: string; serverCallId: string }>;

/**
 * Class to manage the transcription data for the call
 * Holds on to the transcription data and metadata for the call as well as
 * the mapping between the callConnectionId and the correlationId
 * from the transcription service.
 */
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
  private callConnectionIdToCorrelationId: CallConnectionMapping;

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

  /**
   * used to check to see if there is a transcription for the call
   * @param serverCallId
   * @returns
   */
  public hasTranscriptions(serverCallId: string): boolean {
    const connectionId = this.getCallConnectionIDFromServerCallId(serverCallId);
    console.log('Connection ID:', connectionId);
    if (!connectionId) {
      return false;
    }
    const correlationId = this.callConnectionIdToCorrelationId.get(connectionId)?.correlationId;
    return !!correlationId;
  }

  /**
   * used to fetch the transcription data for the call
   * @param serverCallId
   * @returns
   */
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

  /**
   * Stores the transcription metadata for the call
   * @param data - meta data to create the record for the transcription
   * @returns
   */
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

  /**
   * stores the transcription data for the call.
   * Will add to the existing data so the whole transcript can be collected
   * @param data
   * @param eventId
   * @returns
   */
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

  /**
   * Store the participants in the call
   * This is used to keep track of the participants in the call so we can show their display name in the transcription and summary.
   * @param serverCallId
   * @param participants
   */
  public storeParticipantsInCall(
    serverCallId: string,
    participants: Array<{ communicationUserId: string; displayName: string }>
  ): void {
    this.participantsInCallMap.set(serverCallId, participants);
  }

  /**
   * Fetches the CallConnectionId from based on the serverCallId
   * @param serverCallId
   * @returns
   */
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

  /**
   * Gets the CallConnection that contains the correlationId and serverCallId
   * @param callConnectionId - CallConnectionId from the callAutomation client
   * @returns The call connection that contains the correlationId and serverCallId
   */
  public getCallConnection(callConnectionId: string): { correlationId?: string; serverCallId: string } | undefined {
    return this.callConnectionIdToCorrelationId.get(callConnectionId);
  }

  /**
   * Sets the call connection for and a new callConnectionId with the correlationId and serverCallId
   * @param callConnectionId
   * @param serverCallId
   * @param correlationId
   */
  public setCallConnection(callConnectionId: string, serverCallId: string, correlationId?: string): void {
    this.callConnectionIdToCorrelationId.set(callConnectionId, {
      correlationId: correlationId,
      serverCallId: serverCallId
    });
  }

  /**
   * Updates the correlationId for the call connection. This happens when the transcription service starts
   * and we need to update the correlationId for the call connection.
   * @param callConnectionId
   * @param correlationId
   */
  public updateCallConnectionCorrelationId(callConnectionId: string, correlationId: string): void {
    const callConnection = this.callConnectionIdToCorrelationId.get(callConnectionId);
    if (callConnection) {
      callConnection.correlationId = correlationId;
    }
  }

  /**
   * Updates the serverCallId for the call connection.
   * @param callConnectionId
   * @param serverCallId
   */
  public updateCallConnectionServerCallId(callConnectionId: string, serverCallId: string): void {
    const callConnection = this.callConnectionIdToCorrelationId.get(callConnectionId);
    if (callConnection) {
      callConnection.serverCallId = serverCallId;
    }
  }
}
