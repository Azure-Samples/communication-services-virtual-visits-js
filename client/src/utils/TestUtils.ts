// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { act } from '@testing-library/react';

export const fakeTimers = async (): Promise<void> => {
  await act(async () => {
    jest.useFakeTimers();
    jest.runAllTimers();
  });
};
