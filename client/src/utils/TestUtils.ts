// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { act } from '@testing-library/react';

export async function fakeTimers() {
  await act(async () => {
    jest.useFakeTimers();
    jest.runAllTimers();
  });
}
