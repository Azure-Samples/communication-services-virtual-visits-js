// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { RoomsClient } from '@azure/communication-rooms';
import { CommunicationIdentityClient } from '@azure/communication-identity';
import { createRoom, getToken } from './roomsController';
import { CreateRoomResponse, RoomParticipantRole } from '../models/roomModel';
import { ERROR_NO_USER_FOUND_IN_ROOM } from '../constants';

jest.mock('@azure/communication-identity');

describe('roomsController', () => {
  let response;
  let next;
  const validFrom = new Date();
  const validUntilDate = new Date(validFrom);
  validUntilDate.setHours(validFrom.getHours() + 1);
  const validUntil = new Date(validUntilDate);

  const expectedRoomId = 'room-id';
  const expectedToken = 'test-token';
  const expectedPresenterId = 'communicationUserId-presenter';
  const expectedAttendeeId = 'communicationUserId-attendee';

  beforeEach(() => {
    jest.resetAllMocks();
    response = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    } as any;
    next = jest.fn();
  });

  describe('test createRoom', () => {
    test('Should send expected response', async () => {
      const mockedIdentityClient = {
        createUser: async () => ({ communicationUserId: 'testing-communication-user-id' })
      } as CommunicationIdentityClient;

      const mockedRoomsClient = {
        createRoom: async () => ({
          id: expectedRoomId,
          createdOn: validFrom,
          validFrom: validFrom,
          validUntil: validUntil,
          joinPolicy: 'CommunicationServiceUsers',
          participants: [
            {
              id: {
                communicationUserId: expectedPresenterId
              },
              role: RoomParticipantRole.presenter
            },
            {
              id: {
                communicationUserId: expectedAttendeeId
              },
              role: RoomParticipantRole.attendee
            }
          ]
        })
      } as RoomsClient;

      const expectedResponse: CreateRoomResponse = {
        roomId: expectedRoomId,
        participants: [
          {
            id: expectedPresenterId,
            role: RoomParticipantRole.presenter
          },
          {
            id: expectedAttendeeId,
            role: RoomParticipantRole.attendee
          }
        ],
        validFrom: validFrom.toISOString(),
        validUntil: validUntil.toISOString()
      };

      await createRoom(mockedIdentityClient, mockedRoomsClient)({} as any, response, next);

      expect(response.send).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.send).toHaveBeenCalledWith(expectedResponse);
    });

    test('Should send error if createUser fails', async () => {
      const expectedError = new Error('createUser failed');
      const mockedIdentityClient = {
        createUser: jest.fn().mockRejectedValueOnce(expectedError)
      } as any;

      const mockedRoomsClient = {
        createRoom: jest.fn()
      } as any;

      await createRoom(mockedIdentityClient, mockedRoomsClient)({} as any, response, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expectedError);
    });

    test('Should send error if createRoom fails', async () => {
      const expectedError = new Error('createRoom failed');
      const mockedIdentityClient = {
        createUser: jest.fn()
      } as any;

      const mockedRoomsClient = {
        createRoom: jest.fn().mockRejectedValueOnce(expectedError)
      } as any;

      await createRoom(mockedIdentityClient, mockedRoomsClient)({} as any, response, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe('test getToken', () => {
    test('Should send expected response if called for a presenter', async () => {
      const mockedBody = {
        roomId: expectedRoomId,
        userId: expectedPresenterId
      };

      const request: any = { body: mockedBody };

      const mockedIdentityClient = {
        getToken: async (_user, _scopes) => ({ token: expectedToken })
      } as CommunicationIdentityClient;

      const mockedRoomsClient = {
        getParticipants: async (_roomId) => [
          {
            id: {
              communicationUserId: expectedPresenterId
            },
            role: RoomParticipantRole.presenter
          },
          {
            id: {
              communicationUserId: expectedAttendeeId
            },
            role: RoomParticipantRole.attendee
          }
        ]
      } as RoomsClient;

      const expectedResponse = {
        token: expectedToken,
        participant: {
          id: expectedPresenterId,
          role: RoomParticipantRole.presenter
        },
        invitee: {
          id: expectedAttendeeId,
          role: RoomParticipantRole.attendee
        }
      };

      await getToken(mockedIdentityClient, mockedRoomsClient)(request, response, next);

      expect(response.send).toHaveBeenCalled();
      expect(response.send).toHaveBeenCalledWith(expectedResponse);
    });

    test('Should send expected response if called for a attendee', async () => {
      const mockedBody = {
        roomId: expectedRoomId,
        userId: expectedAttendeeId
      };

      const request: any = { body: mockedBody };

      const mockedIdentityClient = {
        getToken: async (_user, _scopes) => ({ token: expectedToken })
      } as CommunicationIdentityClient;

      const mockedRoomsClient = {
        getParticipants: async (_roomId) => [
          {
            id: {
              communicationUserId: expectedPresenterId
            },
            role: RoomParticipantRole.presenter
          },
          {
            id: {
              communicationUserId: expectedAttendeeId
            },
            role: RoomParticipantRole.attendee
          }
        ]
      } as RoomsClient;

      const expectedResponse = {
        token: expectedToken,
        participant: {
          id: expectedAttendeeId,
          role: RoomParticipantRole.attendee
        }
      };

      await getToken(mockedIdentityClient, mockedRoomsClient)(request, response, next);

      expect(response.send).toHaveBeenCalled();
      expect(response.send).toHaveBeenCalledWith(expectedResponse);
    });

    test('Should send error when validation fails on inputdata', async () => {
      const invalidUserId = 1234;
      const mockedBody = {
        roomId: expectedRoomId,
        userId: invalidUserId
      };

      const request: any = { body: mockedBody };

      const mockedIdentityClient = {
        getToken: async (_user, _scopes) => ({ token: expectedToken })
      } as CommunicationIdentityClient;

      const mockedRoomsClient = {
        getParticipants: async (_roomId) => [
          {
            id: {
              communicationUserId: expectedPresenterId
            },
            role: RoomParticipantRole.presenter
          },
          {
            id: {
              communicationUserId: expectedAttendeeId
            },
            role: RoomParticipantRole.attendee
          }
        ]
      } as RoomsClient;

      await getToken(mockedIdentityClient, mockedRoomsClient)(request, response, next);

      expect(response.send).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(400);
    });

    test('Should send error when user id does not exist in participants list', async () => {
      const invalidUserId = 'invalid-user-id';
      const mockedBody = {
        roomId: expectedRoomId,
        userId: invalidUserId
      };

      const request: any = { body: mockedBody };

      const mockedIdentityClient = {
        getToken: async (_user, _scopes) => ({ token: expectedToken })
      } as CommunicationIdentityClient;

      const mockedRoomsClient = {
        getParticipants: async (_roomId) => [
          {
            id: {
              communicationUserId: expectedPresenterId
            },
            role: RoomParticipantRole.presenter
          },
          {
            id: {
              communicationUserId: expectedAttendeeId
            },
            role: RoomParticipantRole.attendee
          }
        ]
      } as RoomsClient;

      await getToken(mockedIdentityClient, mockedRoomsClient)(request, response, next);

      expect(response.send).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.send).toHaveBeenCalledWith(ERROR_NO_USER_FOUND_IN_ROOM);
    });

    test('Should send error if getParticipants fails', async () => {
      const expectedError = new Error('Failed to get participants');
      const mockedBody = {
        roomId: expectedRoomId,
        userId: expectedPresenterId
      };

      const request: any = { body: mockedBody };

      const mockedIdentityClient = {
        getToken: async (_user, _scopes) => ({ token: expectedToken })
      } as CommunicationIdentityClient;

      const mockedRoomsClient = {
        getParticipants: jest.fn().mockRejectedValueOnce(expectedError)
      } as any;

      await getToken(mockedIdentityClient, mockedRoomsClient)(request, response, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expectedError);
    });

    test('Should send error if getToken fails', async () => {
      const expectedError = new Error('Failed to get token');
      const mockedBody = {
        roomId: expectedRoomId,
        userId: expectedPresenterId
      };

      const request: any = { body: mockedBody };

      const mockedIdentityClient = {
        getToken: jest.fn().mockRejectedValueOnce(expectedError)
      } as any;

      const mockedRoomsClient = {
        getParticipants: async (_roomId) => [
          {
            id: {
              communicationUserId: expectedPresenterId
            },
            role: RoomParticipantRole.presenter
          },
          {
            id: {
              communicationUserId: expectedAttendeeId
            },
            role: RoomParticipantRole.attendee
          }
        ]
      } as RoomsClient;

      await getToken(mockedIdentityClient, mockedRoomsClient)(request, response, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
