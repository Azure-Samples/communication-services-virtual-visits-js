// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export const submitSurveyResponse = async (
  callId: string,
  acsUserId: string,
  pollResponse: number | boolean | string
): Promise<void> => {
  try {
    const res = await fetch('/api/surveyResults', {
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      method: 'POST',
      body: JSON.stringify({
        callId: callId,
        acsUserId: acsUserId,
        response: pollResponse
      })
    });
    if (res.status === 200) {
      window.location.replace('/book');
    } else {
      throw new Error('Error during insertion');
    }
  } catch (e) {
    //todo - Error logging;
  }
};
