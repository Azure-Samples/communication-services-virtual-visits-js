// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  VV_COGNITIONAPI_ENDPOINT,
  VV_COGNITIONAPI_KEY,
  VV_SERVER_HTTP_URL,
  VV_SERVER_WEBSOCKET_URL,
  VV_TRANSCRIPTION_BEHAVIOR,
  VV_USE_SUMMARIZATION
} from '../constants';
import { CallAutomationConfig, ServerConfigModel, TranscriptionBehavior } from '../models/configModel';

export const getCallAutomationConfig = (defaultConfig: ServerConfigModel): CallAutomationConfig | undefined => {
  const cognitionAPIEndpoint =
    process.env[VV_COGNITIONAPI_ENDPOINT] ?? (defaultConfig.callAutomation?.CognitionAPIEndpoint as string);
  const cognitionAPIKey = process.env[VV_COGNITIONAPI_KEY] ?? (defaultConfig.callAutomation?.CognitionAPIKey as string);
  const serverHttpUrl = process.env[VV_SERVER_HTTP_URL] ?? (defaultConfig.callAutomation?.ServerHttpUrl as string);

  const serverWebSocketUrl =
    process.env[VV_SERVER_WEBSOCKET_URL] ?? (defaultConfig.callAutomation?.ServerWebSocketUrl as string);
  const useSummarization =
    typeof process.env[VV_USE_SUMMARIZATION] === 'string'
      ? process.env[VV_USE_SUMMARIZATION] === 'true'
        ? true
        : false
      : defaultConfig.callAutomation?.clientOptions?.summarization ?? false;

  const autoStartTranscription =
    process.env[VV_TRANSCRIPTION_BEHAVIOR] ?? defaultConfig.callAutomation?.clientOptions?.transcription;

  const clientOptions = {
    transcription: autoStartTranscription as TranscriptionBehavior,
    summarization: useSummarization
  };

  if (!cognitionAPIEndpoint || !cognitionAPIKey || !serverHttpUrl || !serverWebSocketUrl) {
    return undefined;
  }
  const callAutomationConfig: CallAutomationConfig = {
    CognitionAPIEndpoint: cognitionAPIEndpoint,
    CognitionAPIKey: cognitionAPIKey,
    ServerHttpUrl: serverHttpUrl,
    ServerWebSocketUrl: serverWebSocketUrl,
    clientOptions
  };

  return callAutomationConfig;
};
