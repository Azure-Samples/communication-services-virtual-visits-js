// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationUserIdentifier } from '@azure/communication-common';
import { CallAdapterState, CommonCallAdapter } from '@azure/communication-react';

export type SummarizeResult = {
  recap: string;
  chapters: {
    chapterTitle: string;
    narrative: string;
  }[];
};

export type CallTranscription = {
  text: string;
  confidence: number;
  participant: CommunicationUserIdentifier;
  resultState: 'intermediate' | 'final';
}[];

/**
 * Fetches the transcription for the given server call ID.
 * @param serverCallId - The server call ID to fetch the transcription for.
 * @returns - the CallTranscription object containing the transcription data.
 */
export const fetchTranscript = async (serverCallId: string): Promise<CallTranscription> => {
  const response = await fetch(`/api/fetchTranscript`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      serverCallId
    })
  });
  if (!response.ok) {
    throw new Error('Failed to fetch transcript: ' + response.statusText);
  }

  return ((await response.json()) as { transcript: CallTranscription }).transcript;
};

/**
 * fetches the transcription status for the given server call ID. This is called when
 * the user first joins the call to check if transcription is already started.
 * @param serverCallId - The server call ID to fetch the transcription status for.
 */
export const fetchTranscriptionStatus = async (serverCallId: string): Promise<void> => {
  const response = await fetch(`/api/fetchTranscriptionState`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      serverCallId
    })
  });
  if (!response.ok) {
    throw new Error('Failed to fetch transcription status: ' + response.statusText);
    return;
  }
  return;
};

/**
 * Starts the transcription for the call.
 * @param serverCallId - The server call ID to start transcription for.
 * @param transcriptionOptions - The options for transcription, including locale.
 * @returns - True if the transcription was started successfully, false otherwise.
 */
export const startTranscription = async (
  serverCallId: string,
  transcriptionOptions?: {
    locale?: string;
  }
): Promise<boolean> => {
  console.log('Starting transcription for call:', serverCallId);
  const response = await fetch('/api/startTranscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      serverCallId,
      options: transcriptionOptions
    })
  });
  if (!response.ok) {
    console.error('Failed to start transcription:', response);
    return false;
  }
  console.log('Started transcription:', transcriptionOptions);
  return true;
};

/**
 * Stops the transcription for the call.
 * @param serverCallId - The server call ID to stop transcription for.
 * @returns {boolean} - True if the transcription was stopped successfully, false otherwise.
 */
export const stopTranscription = async (serverCallId: string): Promise<boolean> => {
  console.log('Stopping transcription for call:', serverCallId);

  const response = await fetch('/api/stopTranscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      serverCallId
    })
  });
  if (!response.ok) {
    console.error('Failed to stop transcription:', response);
    return false;
  }
  console.log('Stopped transcription');
  return true;
};

/**
 * Connect the Call Automation service to the call.
 * @param callAdaterState - The call adapter state to check for the call.
 * @returns
 */
export const connectToCallAutomation = async (callAdaterState: CallAdapterState): Promise<boolean> => {
  if (callAdaterState.call?.info !== undefined && callAdaterState.call?.state === 'Connected') {
    const serverCallID = await callAdaterState.call.info.getServerCallId();
    const response = await fetch('/api/connectRoomsCall', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        serverCallId: serverCallID
      })
    });
    if (!response.ok) {
      throw new Error('Failed to start call with transcription');
    }
    return true;
  }
  return false;
};

/**
 * Fetch the call summary from the server.
 * @param adapter - The call adapter to get the call ID from.
 * @param locale - locale code for the language to be used in the summary.
 * @returns summary result if there is a summary available.
 */
export const getCallSummaryFromServer = async (
  adapter: CommonCallAdapter,
  locale: LocaleCode
): Promise<SummarizeResult> => {
  console.log('Getting summary from server...');
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serverCallId = await adapter.getState().call?.info?.getServerCallId();
    if (!serverCallId) {
      console.error('Call ID not found');
      throw new Error('Call ID not found');
    }

    const response = await fetch('/api/summarizeTranscript', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ serverCallId: serverCallId, locale: locale })
    });

    if (!response.ok) {
      console.error('Response Failed: ', response.statusText);
      throw new Error('Summarization request failed');
    }

    const result = await response.json();
    console.log('Summary result:', result);
    return result as SummarizeResult;
  } catch (error) {
    console.error('Error fetching summary:', error);
    throw error;
  }
};

/**
 * Update the participants in the call record for transcription.
 * @param participant - The participant to add to the call record.
 */
export const sendParticipantInfoToServer = async (
  participant: { userId: string; displayName: string },
  serverCallId?: string
): Promise<void> => {
  if (!serverCallId) {
    console.error('Server call ID not found');
    return;
  }
  const response = await fetch('/api/updateParticipants', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      serverCallId: serverCallId,
      participant: participant
    })
  });
  if (!response.ok) {
    console.error('Failed to update participants:', response);
  }
};

/**
 * Fetches the participants in the call. This is needed for when we are computing the transcript for download.
 * @param serverCallId - The server call ID to fetch the participants for.
 * @returns display name and user ID of the participants in the call.
 */
export const fetchParticipants = async (serverCallId: string): Promise<{ userId: string; displayName: string }[]> => {
  const response = await fetch('/api/fetchParticipants', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      serverCallId: serverCallId
    })
  });
  if (!response.ok) {
    console.error('Failed to fetch participants:', response);
    return [];
  }
  return ((await response.json()) as { participants: { userId: string; displayName: string }[] }).participants;
};

/**
 * Language codes used in the localization of the components.
 */
export type LocaleCode =
  | 'ar-AE'
  | 'ar-SA'
  | 'da-DK'
  | 'de-DE'
  | 'en-AU'
  | 'en-CA'
  | 'en-GB'
  | 'en-IN'
  | 'en-NZ'
  | 'en-US'
  | 'es-ES'
  | 'es-MX'
  | 'fi-FI'
  | 'fr-CA'
  | 'fr-FR'
  | 'hi-IN'
  | 'it-IT'
  | 'ja-JP'
  | 'ko-KR'
  | 'nb-NO'
  | 'nl-BE'
  | 'nl-NL'
  | 'pl-PL'
  | 'pt-BR'
  | 'ru-RU'
  | 'sv-SE'
  | 'zh-CN'
  | 'zh-HK'
  | 'cs-CZ'
  | 'pt-PT'
  | 'tr-TR'
  | 'vi-VN'
  | 'th-TH'
  | 'he-IL'
  | 'cy-GB'
  | 'uk-UA'
  | 'el-GR'
  | 'hu-HU'
  | 'ro-RO'
  | 'sk-SK'
  | 'zh-TW';

/**
 * Mapping of locale codes to their display names.
 */
export const localeDisplayNames: Record<LocaleCode, string> = {
  'ar-AE': 'Arabic - U.A.E.',
  'ar-SA': 'Arabic - Saudi Arabia',
  'da-DK': 'Danish',
  'de-DE': 'German - Germany',
  'en-AU': 'English - Australia',
  'en-CA': 'English - Canada',
  'en-GB': 'English - United Kingdom',
  'en-IN': 'English - India',
  'en-NZ': 'English - New Zealand',
  'en-US': 'English - United States',
  'es-ES': 'Spanish - Spain (Modern Sort)',
  'es-MX': 'Spanish - Mexico',
  'fi-FI': 'Finnish',
  'fr-CA': 'French - Canada',
  'fr-FR': 'French - France',
  'hi-IN': 'Hindi',
  'it-IT': 'Italian - Italy',
  'ja-JP': 'Japanese',
  'ko-KR': 'Korean',
  'nb-NO': 'Norwegian (Bokmål)',
  'nl-BE': 'Dutch - Belgium',
  'nl-NL': 'Dutch - Netherlands',
  'pl-PL': 'Polish',
  'pt-BR': 'Portuguese - Brazil',
  'ru-RU': 'Russian',
  'sv-SE': 'Swedish',
  'zh-CN': "Chinese - People's Republic of China",
  'zh-HK': 'Chinese - Hong Kong SAR',
  'cs-CZ': 'Czech',
  'pt-PT': 'Portuguese - Portugal',
  'tr-TR': 'Turkish',
  'vi-VN': 'Vietnamese',
  'th-TH': 'Thai',
  'he-IL': 'Hebrew',
  'cy-GB': 'Welsh',
  'uk-UA': 'Ukrainian',
  'el-GR': 'Greek',
  'hu-HU': 'Hungarian',
  'ro-RO': 'Romanian',
  'sk-SK': 'Slovak',
  'zh-TW': 'Chinese - Taiwan'
};
