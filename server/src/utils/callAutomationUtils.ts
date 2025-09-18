// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CallAutomationClient,
  CallLocator,
  StreamingData,
  TranscriptionData,
  TranscriptionMetadata,
  TranscriptionOptions
} from '@azure/communication-call-automation';
import { ConversationSummaryInput } from './summarizationUtils';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { getServerConfig } from './getConfig';
import { TranscriptionManager } from './TranscriptionManager';

export interface CallTranscription {
  metadata: TranscriptionMetadata;
  data: TranscriptionData[];
}

/**
 * Call automation config is used to configure the call automation client.
 * This is used to connect to the call automation service and start transcription.
 */
const callAutomationConfig = getServerConfig().callAutomation;

/**
 * Call automation config is required for call automation to work.
 * if this is undefined then each of the values that are undefined will be
 * replaced with empty strings.
 *
 * Make sure that you either have your call automation config set in the environment
 * variables or in the config file.
 */
if (!callAutomationConfig) {
  console.warn('Call automation config is not set');
}

/**
 * Manager for the transcription service.
 * This is used to store the transcription data and metadata for each call.
 */
let transcriptionManager: TranscriptionManager | undefined = undefined;

/**
 * Call automation client is used to connect to the call automation service.
 * This is used to start and stop transcription.
 */
let callAutomationClient: CallAutomationClient | undefined = undefined;

/**
 * Function to get the call automation client.
 * This is used to connect to the call automation service and start transcription.
 * @returns the call automation client
 */
export const getCallAutomationClient = (): CallAutomationClient =>
  callAutomationClient ??
  (callAutomationClient = new CallAutomationClient(getServerConfig().communicationServicesConnectionString));

/**
 * Function to get the transcription manager.
 * This is used to store the transcription data and metadata for each call.
 * @returns the transcription manager
 */
export const getTranscriptionManager = (): TranscriptionManager =>
  transcriptionManager ?? (transcriptionManager = new TranscriptionManager());

/**
 * Function to connect to a room call with transcription automatically started.
 * @param roomId - the id of the room to connect to
 * @returns void
 */
export const connectRoomsCallWithTranscription = async (roomId: string): Promise<void> => {
  const transcriptionOptions: TranscriptionOptions = {
    transportUrl: callAutomationConfig?.ServerWebSocketUrl ?? '',
    transportType: 'websocket',
    locale: 'en-US',
    startTranscription: true
  };

  const options = {
    callIntelligenceOptions: {
      cognitiveServicesEndpoint: callAutomationConfig?.CognitionAPIEndpoint
    },
    transcriptionOptions: transcriptionOptions
  };

  const callbackUri = `${callAutomationConfig?.ServerHttpUrl}/api/callAutomationEvent`;

  /**
   * Call automation needs to create the call.
   */

  const automationClient = getCallAutomationClient();
  const roomsLocator: CallLocator = { kind: 'roomCallLocator', id: roomId };
  const connectedCallResult = await automationClient.connectCall(roomsLocator, callbackUri ?? '', options);
  const serverCallId = (await connectedCallResult.callConnection.getCallConnectionProperties()).serverCallId;
  if (!serverCallId) {
    throw new Error('Server call id not found');
  }
  startTranscriptionForCall(serverCallId);
};

/**
 * This is how we attach call automation to the call. We want to not start transcription here. but
 * will start it later when the call connects.
 * @param serverCallId - this can be fetched from the client call object with the handler in the '
 * Call info object.
 */
export const connectRoomsCall = async (serverCallId: string): Promise<void> => {
  const transcriptionOptions: TranscriptionOptions = {
    transportUrl: callAutomationConfig?.ServerWebSocketUrl ?? '',
    transportType: 'websocket',
    locale: 'en-US',
    startTranscription: callAutomationConfig?.clientOptions?.transcription === 'auto' ? true : false
  };

  const connectionId = getTranscriptionManager().getCallConnectionIDFromServerCallId(serverCallId);

  /**
   * Check if the call automation client and connection for the call already exists. If it does, we don't need to create a new one.
   */
  if (connectionId) {
    console.log('Call connection for call already exists:', connectionId);
    return;
  }

  const options = {
    callIntelligenceOptions: {
      cognitiveServicesEndpoint: callAutomationConfig?.CognitionAPIEndpoint ?? ''
    },
    transcriptionOptions: transcriptionOptions
  };
  const res = await getCallAutomationClient().connectCall(
    {
      kind: 'serverCallLocator',
      id: serverCallId
    },
    `${callAutomationConfig?.ServerHttpUrl}/api/callAutomationEvent`,
    options
  );
  console.log('Connect call result', res);
};

/**
 * Function to start transcription for a call.
 * @param serverCallId - this can be fetched from the client call object with the handler in the '
 * Call info object.
 * @param options Options for the transcription
 * @param options.locale - The locale for the transcription. This is used to set the language for the transcription.
 * @returns
 */
export const startTranscriptionForCall = async (
  serverCallId: string,
  options?: TranscriptionOptions
): Promise<void> => {
  console.log('Starting transcription for call:', serverCallId);
  const connectionId = getTranscriptionManager().getCallConnectionIDFromServerCallId(serverCallId);
  if (!connectionId) {
    throw new Error('Call connection id not found');
  }
  const callConnection = await getCallAutomationClient().getCallConnection(connectionId);

  return await callConnection.getCallMedia().startTranscription(options);
};

/**
 *
 * @param callConnectionId
 * @returns
 */
export const stopTranscriptionForCall = async (callConnectionId: string): Promise<void> => {
  console.log('Stopping transcription for call:', callConnectionId);
  const callConnection = await getCallAutomationClient().getCallConnection(callConnectionId);
  return await callConnection.getCallMedia().stopTranscription();
};

/**
 * Fetch the transcription data for a call.
 * @param serverCallId - this can be fetched from the client call object with the handler in the '
 * Call info object.
 * @returns
 */
export const getTranscriptionData = (serverCallId: string): CallTranscription | undefined => {
  console.log('Getting transcription data for call:', serverCallId);
  const connectionId = getTranscriptionManager().getCallConnectionIDFromServerCallId(serverCallId);
  if (!connectionId) {
    console.error('Call connection id not found');
    return undefined;
  }
  return getTranscriptionManager().getTranscriptionData(connectionId);
};

/**
 * Check if transcription has started for the call
 * @param serverCallId - this can be fetched from the client call object with the handler in the '
 * Call info object.
 * @returns true if transcription has started for the call
 * @returns false if transcription has not started for the call
 */
export const checkIfTranscriptionStarted = (serverCallId: string): boolean => {
  console.log('Checking if transcription started for call:', serverCallId);
  const connectionId = getTranscriptionManager().getCallConnectionIDFromServerCallId(serverCallId);
  if (!connectionId) {
    return false;
  }
  return getTranscriptionManager().hasTranscriptions(connectionId);
};

/**
 * This function handles the transcription event and parses the data.
 * @returns id to correlate future transcription data
 * @param packetData - the data from the transcription event
 * @param packetId - the id of the transcription event
 */
export const handleTranscriptionEvent = (packetData: unknown, packetId: string | undefined): string | undefined => {
  const decoder = new TextDecoder();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stringJson = decoder.decode(packetData as any);

  const parsedData = StreamingData.parse(stringJson);

  if ('locale' in parsedData) {
    const id = handleTranscriptionMetadataEvent(parsedData);
    return id;
  }
  if ('text' in parsedData && packetId) {
    handleTranscriptionDataEvent(parsedData, packetId);
  }

  return packetId;
};

/**
 * This function handles the transcription metadata event and parses the data.
 * @param eventData - the data from the transcription event
 * @param eventId - the id of the transcription event
 * @returns id to correlate future transcription data
 */
export const handleTranscriptionMetadataEvent = (eventData: TranscriptionMetadata): string => {
  console.log('--------------------------------------------');
  console.log('Transcription Metadata');
  console.log('CALL CONNECTION ID:-->' + eventData.callConnectionId);
  console.log('CORRELATION ID:-->' + eventData.correlationId);
  console.log('LOCALE:-->' + eventData.locale);
  console.log('SUBSCRIPTION ID:-->' + eventData.subscriptionId);
  console.log('--------------------------------------------');

  getTranscriptionManager().storeTranscriptionMetadata(eventData);

  return eventData.correlationId;
};

/**
 * Handle the transcription data event and parse the data.
 * @param eventData - the data from the transcription event
 * @param eventId - the id of the transcription event
 */
export const handleTranscriptionDataEvent = (eventData: TranscriptionData, eventId: string): void => {
  console.log('--------------------------------------------');
  console.log('Transcription Data');
  console.log('TEXT:-->' + eventData.text);
  console.log('CALL CORELLATION ID: -->' + eventId);
  console.log('FORMAT:-->' + eventData.format);
  console.log('CONFIDENCE:-->' + eventData.confidence);
  console.log('OFFSET IN TICKS:-->' + eventData.offsetInTicks);
  console.log('DURATION IN TICKS:-->' + eventData.durationInTicks);
  console.log('RESULT STATE:-->' + eventData.resultState);
  if ('phoneNumber' in eventData.participant) {
    console.log('PARTICIPANT:-->' + eventData.participant.phoneNumber);
  }
  if ('communicationUserId' in eventData.participant) {
    console.log('PARTICIPANT:-->' + eventData.participant.communicationUserId);
  }
  eventData.words.forEach((element) => {
    console.log('TEXT:-->' + element.text);
    console.log('DURATION IN TICKS:-->' + element.durationInTicks);
    console.log('OFFSET IN TICKS:-->' + element.offsetInTicks);
  });
  console.log('--------------------------------------------');

  getTranscriptionManager().storeTranscriptionData(eventData, eventId);
};

/**
 * function to format the transcription data for summarization
 * @param transcription - the transcription data to format
 * @returns transcription data formatted for summarization
 */
export const formatTranscriptionForSummarization = async (
  transcription: CallTranscription
): Promise<ConversationSummaryInput> => {
  const formattedTranscription: ConversationSummaryInput = transcription.data.map((data) => ({
    author: (data.participant as CommunicationUserIdentifier).communicationUserId, // TODO: get displayName by having the server collect and store the chosen display name
    text: data.text
  }));

  return formattedTranscription;
};
