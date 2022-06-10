// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect, test } from "@playwright/test";
import { buildUrl } from "./utils";

const SERVER_URL = "http://localhost:8080";

test.describe("tests:", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(buildUrl(SERVER_URL, "book"));
  });

  test("navigating to book", async ({ page }) => {
    await page.isVisible(".BookMeetingSection");
    expect(await page.screenshot()).toMatchSnapshot("bookScreenshot.png");
  });
});
