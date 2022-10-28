// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import type { PlaywrightTestConfig } from "@playwright/test";
import path from "path";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: "./tests",
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  // /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
        permissions: ["notifications", "camera", "microphone"],
        viewport: { width: 900, height: 900 },
        launchOptions: {
          args: [
            "--font-render-hinting=none", // Ensures that fonts are rendered consistently.
            "--enable-font-antialiasing", // Ensures that fonts are rendered consistently.
            "--disable-gpu", // Ensures that fonts are rendered consistently.
            "--allow-file-access",
            "--use-fake-ui-for-media-stream",
            "--use-fake-device-for-media-stream",
            `--use-file-for-fake-video-capture=${path.join(
              __dirname,
              "common",
              "test.y4m"
            )}`,
            "--lang=en-US",
            "--mute-audio",
          ],
        },
      },
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "cd ../server && npm run start:prod",
    port: 8080,
    env: {
      ["NODE_TLS_REJECT_UNAUTHORIZED"]: "0",
    },
  },
};

config.snapshotDir = `./tests/snapshots`;

export default config;
