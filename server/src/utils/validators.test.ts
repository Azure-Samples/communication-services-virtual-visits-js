// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { surveyResultRequestValidator } from './validators';

describe('validators test', () => {
  describe('testing surveyResultRequestValidator', () => {
    describe('testing when fields are not present', () => {
      test.each([
        [
          1,
          ['callId must be present'],
          { acsUserId: 'test_acs_user_id', meetingLink: 'test_meeting_link', response: true }
        ],
        [
          1,
          ['acsUserId must be present'],
          { callId: 'test_call_id', meetingLink: 'test_meeting_link', response: true }
        ],
        [1, ['meetingLink must be present'], { callId: 'test_call_id', acsUserId: 'test_acs_user_id', response: true }],
        [
          1,
          ['response must be present'],
          { callId: 'test_call_id', acsUserId: 'test_acs_user_id', meetingLink: 'test_meeting_link' }
        ],
        [
          2,
          ['callId must be present', 'acsUserId must be present'],
          { meetingLink: 'test_meeting_link', response: true }
        ],
        [
          2,
          ['callId must be present', 'meetingLink must be present'],
          { acsUserId: 'test_acs_user_id', response: true }
        ],
        [
          2,
          ['callId must be present', 'response must be present'],
          { acsUserId: 'test_acs_user_id', meetingLink: 'test_meeting_link' }
        ],
        [2, ['acsUserId must be present', 'meetingLink must be present'], { callId: 'test_call_id', response: true }],
        [
          2,
          ['acsUserId must be present', 'response must be present'],
          { callId: 'test_call_id', meetingLink: 'test_meeting_link' }
        ],
        [
          2,
          ['meetingLink must be present', 'response must be present'],
          { callId: 'test_call_id', acsUserId: 'test_acs_user_id' }
        ],
        [3, ['callId must be present', 'acsUserId must be present', 'meetingLink must be present'], { response: true }],
        [
          3,
          ['acsUserId must be present', 'meetingLink must be present', 'response must be present'],
          { callId: 'test_call_id' }
        ],
        [
          3,
          ['callId must be present', 'acsUserId must be present', 'response must be present'],
          { meetingLink: 'test_meeting_link' }
        ],
        [
          3,
          ['callId must be present', 'meetingLink must be present', 'response must be present'],
          { acsUserId: 'test_acs_user_id' }
        ],
        [
          4,
          [
            'callId must be present',
            'acsUserId must be present',
            'meetingLink must be present',
            'response must be present'
          ],
          {}
        ]
      ])('Test when %d input fields missing: %s', (_, expectedErrors: string[], invalidInput: any) => {
        const errors = surveyResultRequestValidator(invalidInput);

        expect(errors).toEqual(expectedErrors);
      });
    });

    describe('testing when field type is not correct', () => {
      test.each([
        [
          'callId',
          ['callId type must be string'],
          { callId: 1, acsUserId: 'test_acs_user_id', meetingLink: 'test_meeting_link', response: true }
        ],
        [
          'acsUserId',
          ['acsUserId type must be string'],
          { callId: 'testing_call_id', acsUserId: 1, meetingLink: 'test_meeting_link', response: true }
        ],
        [
          'meetingLink',
          ['meetingLink type must be string'],
          { callId: 'testing_call_id', acsUserId: 'test_acs_user_id', meetingLink: 1, response: true }
        ],
        [
          'response',
          ['response type must be one of boolean, string, number'],
          { callId: 'tesing_call_id', acsUserId: 'testing_acs_user_id', meetingLink: 'test_meeting_link', response: {} }
        ]
      ])('Test when %s input field type is wrong.', (_, expectedErrors: string[], invalidInput: any) => {
        const errors = surveyResultRequestValidator(invalidInput);

        expect(errors).toEqual(expectedErrors);
      });
    });
  });
});
