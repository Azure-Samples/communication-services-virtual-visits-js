// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { OneQuestionPollType, ServerConfigModel } from '../models/configModel';
import getPostCallConfig from './getPostCallConfig';

describe('getPostCallConfig', () => {
  beforeEach(() => {
    delete process.env.VV_POSTCALL_SURVEY_TYPE;
    delete process.env.VV_POSTCALL_SURVEY_OPTIONS_SURVEYURL;
    delete process.env.VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_TITLE;
    delete process.env.VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_TYPE;
    delete process.env.VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_PROMPT;
    delete process.env.VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_ANSWER_PLACEHOLDER;
    delete process.env.VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_SAVE_BUTTON_TEXT;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return undefined if post call is undefined', () => {
    const mockDefaultConfig: ServerConfigModel = {
      communicationServicesConnectionString: 'dummy endpoint',
      microsoftBookingsUrl: 'dummyBookingsUrl',
      chatEnabled: true,
      screenShareEnabled: true,
      companyName: 'test Healthcare',
      colorPalette: '#0078d4',
      waitingTitle: 'Thank you for choosing Lamna Healthcare',
      waitingSubtitle: 'Your clinician is joining the meeting',
      logoUrl: ''
    };
    const result = getPostCallConfig(mockDefaultConfig);

    expect(result).toBeUndefined();
  });

  it('should return undefined if post call type is invalid', () => {
    process.env.VV_POSTCALL_SURVEY_TYPE = 'random';

    const mockDefaultConfig: ServerConfigModel = {
      communicationServicesConnectionString: 'dummy endpoint',
      microsoftBookingsUrl: 'dummyBookingsUrl',
      chatEnabled: true,
      screenShareEnabled: true,
      companyName: 'test Healthcare',
      colorPalette: '#0078d4',
      waitingTitle: 'Thank you for choosing Lamna Healthcare',
      waitingSubtitle: 'Your clinician is joining the meeting',
      logoUrl: ''
    };
    const result = getPostCallConfig(mockDefaultConfig);

    expect(result).toBeUndefined();
  });

  describe('msforms', () => {
    it('should use environment variables if defined', () => {
      const expectedSurveyUrl = 'msformstesturl';

      process.env.VV_POSTCALL_SURVEY_TYPE = 'msforms';
      process.env.VV_POSTCALL_SURVEY_OPTIONS_SURVEYURL = expectedSurveyUrl;

      const mockDefaultConfig: ServerConfigModel = {
        communicationServicesConnectionString: 'dummy endpoint',
        microsoftBookingsUrl: 'dummyBookingsUrl',
        chatEnabled: true,
        screenShareEnabled: true,
        companyName: 'test Healthcare',
        colorPalette: '#0078d4',
        waitingTitle: 'Thank you for choosing Lamna Healthcare',
        waitingSubtitle: 'Your clinician is joining the meeting',
        logoUrl: '',
        postCall: {
          survey: { type: 'msforms', options: { surveyUrl: 'someOtherUrl' } }
        }
      };
      const result = getPostCallConfig(mockDefaultConfig);

      expect(result).toStrictEqual({
        survey: {
          type: 'msforms',
          options: {
            surveyUrl: expectedSurveyUrl
          }
        }
      });
    });

    it('should use defaultConfig if environment variables are not set', () => {
      const expectedSurveyUrl = 'msFormsSurveyURL';
      const mockDefaultConfig: ServerConfigModel = {
        communicationServicesConnectionString: 'dummy endpoint',
        microsoftBookingsUrl: 'dummyBookingsUrl',
        chatEnabled: true,
        screenShareEnabled: true,
        companyName: 'test Healthcare',
        colorPalette: '#0078d4',
        waitingTitle: 'Thank you for choosing Lamna Healthcare',
        waitingSubtitle: 'Your clinician is joining the meeting',
        logoUrl: '',
        postCall: {
          survey: { type: 'msforms', options: { surveyUrl: expectedSurveyUrl } }
        }
      };

      const result = getPostCallConfig(mockDefaultConfig);

      expect(result).toStrictEqual({
        survey: {
          type: 'msforms',
          options: {
            surveyUrl: expectedSurveyUrl
          }
        }
      });
    });
  });

  describe('custom', () => {
    it('should use environment variables if defined', () => {
      const expectedSurveyUrl = 'customtesturl';

      process.env.VV_POSTCALL_SURVEY_TYPE = 'custom';
      process.env.VV_POSTCALL_SURVEY_OPTIONS_SURVEYURL = expectedSurveyUrl;

      const mockDefaultConfig: ServerConfigModel = {
        communicationServicesConnectionString: 'dummy endpoint',
        microsoftBookingsUrl: 'dummyBookingsUrl',
        chatEnabled: true,
        screenShareEnabled: true,
        companyName: 'test Healthcare',
        colorPalette: '#0078d4',
        waitingTitle: 'Thank you for choosing Lamna Healthcare',
        waitingSubtitle: 'Your clinician is joining the meeting',
        logoUrl: '',
        postCall: {
          survey: { type: 'custom', options: { surveyUrl: 'someOtherUrl' } }
        }
      };
      const result = getPostCallConfig(mockDefaultConfig);

      expect(result).toStrictEqual({
        survey: {
          type: 'custom',
          options: {
            surveyUrl: expectedSurveyUrl
          }
        }
      });
    });

    it('should use defaultConfig if environment variables are not set', () => {
      const expectedSurveyUrl = 'customSurveyURL';
      const mockDefaultConfig: ServerConfigModel = {
        communicationServicesConnectionString: 'dummy endpoint',
        microsoftBookingsUrl: 'dummyBookingsUrl',
        chatEnabled: true,
        screenShareEnabled: true,
        companyName: 'test Healthcare',
        colorPalette: '#0078d4',
        waitingTitle: 'Thank you for choosing Lamna Healthcare',
        waitingSubtitle: 'Your clinician is joining the meeting',
        logoUrl: '',
        postCall: {
          survey: { type: 'custom', options: { surveyUrl: expectedSurveyUrl } }
        }
      };

      const result = getPostCallConfig(mockDefaultConfig);

      expect(result).toStrictEqual({
        survey: {
          type: 'custom',
          options: {
            surveyUrl: expectedSurveyUrl
          }
        }
      });
    });
  });

  describe('onequestionpoll', () => {
    it.each([['likeOrDislike'], ['rating'], ['text']])(
      'should use environment variables if defined - pollType %s',
      (pollType: string) => {
        const expectedTitle = 'my title';
        const expectedType = pollType;
        const expectedPrompt = 'How was the call?';
        const expectedAnswerPlaceholder = 'Tell us why';
        const expectedSaveButtonText = 'Submit';

        process.env.VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_TITLE = expectedTitle;
        process.env.VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_TYPE = expectedType;
        process.env.VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_PROMPT = expectedPrompt;
        process.env.VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_ANSWER_PLACEHOLDER = expectedAnswerPlaceholder;
        process.env.VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_SAVE_BUTTON_TEXT = expectedSaveButtonText;

        const mockDefaultConfig: ServerConfigModel = {
          communicationServicesConnectionString: 'dummy endpoint',
          microsoftBookingsUrl: 'dummyBookingsUrl',
          chatEnabled: true,
          screenShareEnabled: true,
          companyName: 'test Healthcare',
          colorPalette: '#0078d4',
          waitingTitle: 'Thank you for choosing Lamna Healthcare',
          waitingSubtitle: 'Your clinician is joining the meeting',
          logoUrl: '',
          postCall: {
            survey: {
              type: 'onequestionpoll',
              options: {
                title: 'Tell us how we did',
                prompt: `How satisfied are you with this virtual appointment's audio and video quality?`,
                pollType: pollType as OneQuestionPollType,
                answerPlaceholder: 'my answer placeholder',
                saveButtonText: 'Continue'
              }
            }
          }
        };

        const result = getPostCallConfig(mockDefaultConfig);

        expect(result).toStrictEqual({
          survey: {
            type: 'onequestionpoll',
            options: {
              title: expectedTitle,
              prompt: expectedPrompt,
              pollType: expectedType,
              answerPlaceholder: expectedAnswerPlaceholder,
              saveButtonText: expectedSaveButtonText
            }
          }
        });
      }
    );

    it.each([['likeOrDislike'], ['rating'], ['text']])(
      'should use defaultConfig if environment variables are not set - pollType %s',
      (pollType: string) => {
        const expectedTitle = 'my title';
        const expectedType = pollType;
        const expectedPrompt = 'How was the call?';
        const expectedAnswerPlaceholder = 'Tell us why';
        const expectedSaveButtonText = 'Submit';

        const mockDefaultConfig: ServerConfigModel = {
          communicationServicesConnectionString: 'dummy endpoint',
          microsoftBookingsUrl: 'dummyBookingsUrl',
          chatEnabled: true,
          screenShareEnabled: true,
          companyName: 'test Healthcare',
          colorPalette: '#0078d4',
          waitingTitle: 'Thank you for choosing Lamna Healthcare',
          waitingSubtitle: 'Your clinician is joining the meeting',
          logoUrl: '',
          postCall: {
            survey: {
              type: 'onequestionpoll',
              options: {
                title: expectedTitle,
                prompt: expectedPrompt,
                pollType: expectedType as OneQuestionPollType,
                answerPlaceholder: expectedAnswerPlaceholder,
                saveButtonText: expectedSaveButtonText
              }
            }
          }
        };

        const result = getPostCallConfig(mockDefaultConfig);

        expect(result).toStrictEqual({
          survey: {
            type: 'onequestionpoll',
            options: {
              title: expectedTitle,
              prompt: expectedPrompt,
              pollType: expectedType,
              answerPlaceholder: expectedAnswerPlaceholder,
              saveButtonText: expectedSaveButtonText
            }
          }
        });
      }
    );
  });
});
