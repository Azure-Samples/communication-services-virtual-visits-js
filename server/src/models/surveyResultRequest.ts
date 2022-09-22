// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { SurveyResultRequestModel } from '../interfaces/surveyModel';

class SurveyResultRequest {
  public dateTime: SurveyResultRequestModel['dateTime'];
  public sessionId: SurveyResultRequestModel['sessionId'];
  public callId: SurveyResultRequestModel['callId'];
  public acsUserId: SurveyResultRequestModel['acsUserId'];
  public response: SurveyResultRequestModel['response'];

  constructor(payload: SurveyResultRequestModel) {
    const { dateTime, sessionId, callId, acsUserId, response } = payload;
    this.dateTime = dateTime;
    this.sessionId = sessionId;
    this.callId = callId;
    this.acsUserId = acsUserId;
    this.response = response;
  }
}

export default SurveyResultRequest;
