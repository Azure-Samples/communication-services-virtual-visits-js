// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MSFormsSurveyOptions } from '../models/ConfigModel';
import { fetchConfig } from './FetchConfig';

let fetchBackup: any = undefined;

beforeEach(() => {
  fetchBackup = global.fetch;
});

afterEach(() => {
  global.fetch = fetchBackup;
});

describe('FetchConfig', () => {
  test('Should return config if everything is successful', async () => {
    const mockConfig = {
      microsoftBookingsUrl: 'https://url',
      chatEnabled: true,
      screenShareEnabled: true,
      companyName: 'Company',
      colorPalette: '#FFFFFF',
      waitingTitle: 'title',
      waitingSubtitle: 'subtitle',
      postCall: {
        survey: { type: 'msforms', options: { surveyUrl: 'msFormsSurveyURL' } }
      }
    };

    global.fetch = jest.fn(
      (_: RequestInfo | URL, __?: RequestInit | undefined): Promise<Response> => {
        return Promise.resolve<Response>({
          status: 200,
          text: () => Promise.resolve(JSON.stringify(mockConfig))
        } as Response);
      }
    );

    const fetchedConfig = await fetchConfig();
    const options: MSFormsSurveyOptions = fetchedConfig?.postCall?.survey.options as MSFormsSurveyOptions;

    expect(fetchedConfig).toBeDefined();
    expect(fetchedConfig?.microsoftBookingsUrl).toBe(mockConfig.microsoftBookingsUrl);
    expect(fetchedConfig?.chatEnabled).toBe(mockConfig.chatEnabled);
    expect(fetchedConfig?.screenShareEnabled).toBe(mockConfig.screenShareEnabled);
    expect(fetchedConfig?.companyName).toBe(mockConfig.companyName);
    expect(fetchedConfig?.waitingTitle).toBe(mockConfig.waitingTitle);
    expect(fetchedConfig?.theme).toBeDefined();
    expect(fetchedConfig?.waitingSubtitle).toBe(mockConfig.waitingSubtitle);
    expect(fetchedConfig?.postCall).toBeDefined();
    expect(fetchedConfig?.postCall?.survey).toBeDefined();
    expect(fetchedConfig?.postCall?.survey.type).toBe('msforms');
    expect(fetchedConfig?.postCall?.survey.options).toBeDefined();
    expect(options.surveyUrl).toBe('msFormsSurveyURL');
  });

  test('Should return undefined if status code is not 200', async () => {
    const mockConfig = {
      microsoftBookingsUrl: 'https://url',
      chatEnabled: true,
      screenShareEnabled: true,
      companyName: 'Company',
      colorPalette: '#FFFFFF',
      waitingTitle: 'title',
      waitingSubtitle: 'subtitle'
    };

    global.fetch = jest.fn(
      (_: RequestInfo | URL, __?: RequestInit | undefined): Promise<Response> => {
        return Promise.resolve<Response>({
          status: 500,
          json: () => Promise.resolve(mockConfig)
        } as Response);
      }
    );

    let gotError = false;
    try {
      await fetchConfig();
    } catch (error) {
      gotError = true;
    }

    expect(gotError).toBeTruthy();
  });

  test('Should return undefined if there is no valid json response', async () => {
    global.fetch = jest.fn(
      (_: RequestInfo | URL, __?: RequestInit | undefined): Promise<Response> => {
        return Promise.resolve<Response>({
          status: 200,
          json: () => Promise.resolve(undefined)
        } as Response);
      }
    );

    let gotError = false;
    try {
      await fetchConfig();
    } catch (error) {
      gotError = true;
    }

    expect(gotError).toBeTruthy();
  });
});
