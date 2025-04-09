// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  VV_AUTO_START_TRANSCRIPTION,
  VV_COGNITIONAPI_ENDPOINT,
  VV_COGNITIONAPI_KEY,
  VV_SERVER_HTTP_URL,
  VV_SERVER_WEBSOCKET_PORT,
  VV_SERVER_WEBSOCKET_URL
} from '../constants';
import { CallAutomationConfig, ServerConfigModel } from '../models/configModel';

export const getCallAutomationConfig = (defaultConfig: ServerConfigModel): CallAutomationConfig | undefined => {
  const cognitionAPIEndpoint =
    process.env[VV_COGNITIONAPI_ENDPOINT] ?? (defaultConfig.callAutomation?.CognitionAPIEndpoint as string);
  const cognitionAPIKey = process.env[VV_COGNITIONAPI_KEY] ?? (defaultConfig.callAutomation?.CognitionAPIKey as string);
  const serverHttpUrl = process.env[VV_SERVER_HTTP_URL] ?? (defaultConfig.callAutomation?.ServerHttpUrl as string);
  const serverWebSocketPort =
    process.env[VV_SERVER_WEBSOCKET_PORT] ?? defaultConfig.callAutomation?.ServerWebSocketPort;
  const serverWebSocketUrl =
    process.env[VV_SERVER_WEBSOCKET_URL] ?? (defaultConfig.callAutomation?.ServerWebSocketUrl as string);
  const autoStartTranscription =
    (process.env[VV_AUTO_START_TRANSCRIPTION] as string) ?? defaultConfig.callAutomation?.AutoStartTranscription;

  if (!cognitionAPIEndpoint || !cognitionAPIKey || !serverHttpUrl || !serverWebSocketPort || !serverWebSocketUrl) {
    return undefined;
  }
  const callAutomationConfig: CallAutomationConfig = {
    CognitionAPIEndpoint: cognitionAPIEndpoint,
    CognitionAPIKey: cognitionAPIKey,
    ServerHttpUrl: serverHttpUrl,
    ServerWebSocketPort: typeof serverWebSocketPort === 'string' ? parseInt(serverWebSocketPort) : serverWebSocketPort,
    ServerWebSocketUrl: serverWebSocketUrl,
    AutoStartTranscription:
      typeof autoStartTranscription === 'string' ? Boolean(autoStartTranscription) : autoStartTranscription
  };

  return callAutomationConfig;
};
