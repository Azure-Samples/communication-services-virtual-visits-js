// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TranscriptionManager } from './TranscriptionManager';
import { TranscriptionData, TranscriptionMetadata } from '@azure/communication-call-automation';

describe('TranscriptionManager', () => {
  let transcriptionManager: TranscriptionManager;

  // Sample test data
  const mockCallConnectionId = 'test-connection-id';
  const mockServerCallId = 'test-server-call-id';
  const mockCorrelationId = 'test-correlation-id';
  const mockParticipant = {
    communicationUserId: 'test-user-id',
    displayName: 'Test User'
  };

  const mockMetadata: TranscriptionMetadata = {
    callConnectionId: mockCallConnectionId,
    correlationId: mockCorrelationId,
    locale: 'en-US',
    speechRecognitionModelEndpointId: 'test-endpoint-id',
    subscriptionId: 'test-subscription-id'
  };

  const mockTranscriptionData: TranscriptionData = {
    text: 'Hello, this is a test',
    confidence: 0.95,
    durationInTicks: 1000,
    offsetInTicks: 500,
    resultState: 'final',
    format: 'Display',
    participant: {
      communicationUserId: mockParticipant.communicationUserId
    },
    words: [
      {
        text: 'Hello,',
        offsetInTicks: 500,
        durationInTicks: 250
      },
      {
        text: 'this is a test',
        offsetInTicks: 750,
        durationInTicks: 750
      }
    ]
  };

  beforeEach(() => {
    // Create a new instance of TranscriptionManager before each test
    transcriptionManager = new TranscriptionManager();

    // Set up initial call connection with server call ID
    transcriptionManager.setCallConnection(mockCallConnectionId, mockServerCallId);
  });

  describe('Call connection management', () => {
    test('should set and get call connection', () => {
      // The connection was set in beforeEach
      const connection = transcriptionManager.getCallConnection(mockCallConnectionId);

      expect(connection).toBeDefined();
      expect(connection?.serverCallId).toBe(mockServerCallId);
      expect(connection?.correlationId).toBeUndefined();
    });

    test('should get call connection ID from server call ID', () => {
      const connectionId = transcriptionManager.getCallConnectionIDFromServerCallId(mockServerCallId);

      expect(connectionId).toBe(mockCallConnectionId);
    });

    test('should update correlation ID for a call connection', () => {
      transcriptionManager.updateCallConnectionCorrelationId(mockCallConnectionId, mockCorrelationId);

      const connection = transcriptionManager.getCallConnection(mockCallConnectionId);
      expect(connection?.correlationId).toBe(mockCorrelationId);
    });

    test('should update server call ID for a call connection', () => {
      const newServerCallId = 'new-server-call-id';
      transcriptionManager.updateCallConnectionServerCallId(mockCallConnectionId, newServerCallId);

      const connection = transcriptionManager.getCallConnection(mockCallConnectionId);
      expect(connection?.serverCallId).toBe(newServerCallId);
    });
  });

  describe('Transcription data management', () => {
    test('should store and retrieve transcription metadata', () => {
      transcriptionManager.storeTranscriptionMetadata(mockMetadata);

      // Check if correlation ID was updated
      const connection = transcriptionManager.getCallConnection(mockCallConnectionId);
      expect(connection?.correlationId).toBe(mockCorrelationId);

      // Check if hasTranscriptions returns true
      expect(transcriptionManager.hasTranscriptions(mockCallConnectionId)).toBe(true);

      // Get transcription data
      const transcriptionData = transcriptionManager.getTranscriptionData(mockCallConnectionId);
      expect(transcriptionData).toBeDefined();
      expect(transcriptionData?.metadata).toEqual(mockMetadata);
      expect(transcriptionData?.data).toEqual([]);
    });

    test('should store transcription data', () => {
      // First store metadata to create the correlation
      transcriptionManager.storeTranscriptionMetadata(mockMetadata);

      // Then store data
      transcriptionManager.storeTranscriptionData(mockTranscriptionData, mockCorrelationId);

      // Get transcription data
      const transcriptionData = transcriptionManager.getTranscriptionData(mockCallConnectionId);
      expect(transcriptionData).toBeDefined();
      expect(transcriptionData?.data.length).toBe(1);
      expect(transcriptionData?.data[0]).toEqual(mockTranscriptionData);
    });

    test('should not store data if correlation ID not found', () => {
      // Try to store data without setting metadata first
      const nonExistentCorrelationId = 'non-existent-id';

      // This should log an error but not throw
      transcriptionManager.storeTranscriptionData(mockTranscriptionData, nonExistentCorrelationId);

      // Get transcription data - should be undefined since nothing was stored
      const transcriptionData = transcriptionManager.getTranscriptionData(mockCallConnectionId);
      expect(transcriptionData).toBeUndefined();
    });
  });

  describe('Participants management', () => {
    test('should store and retrieve participants in a call', () => {
      transcriptionManager.storeParticipantInCall(mockServerCallId, mockParticipant);

      const participants = transcriptionManager.getParticipantsInCall(mockServerCallId);
      expect(participants.length).toBe(1);
      expect(participants[0]).toEqual(mockParticipant);
    });

    test('should append new participants to existing list', () => {
      const firstParticipant = { communicationUserId: 'user1', displayName: 'User 1' };
      const secondParticipant = { communicationUserId: 'user2', displayName: 'User 2' };

      transcriptionManager.storeParticipantInCall(mockServerCallId, firstParticipant);
      transcriptionManager.storeParticipantInCall(mockServerCallId, secondParticipant);

      const participants = transcriptionManager.getParticipantsInCall(mockServerCallId);
      expect(participants.length).toBe(2);
      expect(participants).toContainEqual(firstParticipant);
      expect(participants).toContainEqual(secondParticipant);
    });

    test('should return empty array for non-existent server call ID', () => {
      const participants = transcriptionManager.getParticipantsInCall('non-existent');
      expect(participants).toEqual([]);
    });
  });

  describe('Edge cases', () => {
    test('should handle metadata without correlation ID', () => {
      const invalidMetadata = { ...mockMetadata, correlationId: undefined };

      // This should log an error but not throw
      transcriptionManager.storeTranscriptionMetadata(invalidMetadata as any);

      // Should not have updated the correlation ID
      expect(transcriptionManager.hasTranscriptions(mockCallConnectionId)).toBe(false);
    });

    test('should handle non-existent connection ID', () => {
      const transcriptionData = transcriptionManager.getTranscriptionData('non-existent');
      expect(transcriptionData).toBeUndefined();
    });
  });
});
