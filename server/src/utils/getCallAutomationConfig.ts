// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  VV_COGNITIONAPI_ENDPOINT,
  VV_COGNITIONAPI_KEY,
  VV_SERVER_HTTP_URL,
  VV_SERVER_WEBSOCKET_PORT,
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
  const serverWebSocketPort =
    process.env[VV_SERVER_WEBSOCKET_PORT] ?? defaultConfig.callAutomation?.ServerWebSocketPort;
  const serverWebSocketUrl =
    process.env[VV_SERVER_WEBSOCKET_URL] ?? (defaultConfig.callAutomation?.ServerWebSocketUrl as string);
  const useSummarization =
    process.env[VV_USE_SUMMARIZATION] ?? defaultConfig.callAutomation?.clientOptions?.summarization ?? false;
  const autoStartTranscription =
    process.env[VV_TRANSCRIPTION_BEHAVIOR] ?? defaultConfig.callAutomation?.clientOptions?.transcription;

  const clientOptions = {
    transcription: autoStartTranscription as TranscriptionBehavior,
    summarization: Boolean(useSummarization)
  };
  if (!cognitionAPIEndpoint || !cognitionAPIKey || !serverHttpUrl || !serverWebSocketPort || !serverWebSocketUrl) {
    return undefined;
  }
  const callAutomationConfig: CallAutomationConfig = {
    CognitionAPIEndpoint: cognitionAPIEndpoint,
    CognitionAPIKey: cognitionAPIKey,
    ServerHttpUrl: serverHttpUrl,
    ServerWebSocketPort: typeof serverWebSocketPort === 'string' ? parseInt(serverWebSocketPort) : serverWebSocketPort,
    ServerWebSocketUrl: serverWebSocketUrl,
    clientOptions
  };

  return callAutomationConfig;
};
