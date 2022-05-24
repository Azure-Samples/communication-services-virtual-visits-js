// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export interface ServerConfigModel {
  communicationServicesConnectionString: string;
  microsoftBookingsUrl: string;
  chatEnabled: boolean;
  screenShareEnabled: boolean;
  companyName: string;
  colorPalette: string;
  waitingTitle: string;
  waitingSubtitle: string;
  logoUrl: string;
  userDisplayName: string;
}

export interface ClientConfigModel {
  communicationEndpoint: string;
  microsoftBookingsUrl: string;
  chatEnabled: boolean;
  screenShareEnabled: boolean;
  companyName: string;
  colorPalette: string;
  waitingTitle: string;
  waitingSubtitle: string;
  logoUrl: string;
  userDisplayName: string;
}
