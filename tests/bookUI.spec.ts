// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

//This is the test case if we follow UI way of doing E2E's
import { expect } from "@playwright/test";
import { buildUrl } from "./utils";
import { test } from "./fixture";

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
