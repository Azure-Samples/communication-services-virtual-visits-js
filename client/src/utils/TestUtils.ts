// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { act } from '@testing-library/react';

export async function flushPromises() {
  return new Promise((resolve) => setImmediate(resolve));
}

export async function runFakeTimers() {
  await act(async () => {
    jest.useFakeTimers();
    jest.runAllTimers();
  });
}