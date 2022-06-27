// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect, test } from "@playwright/test";
import { buildUrl, delay, DELAY_MS, testMeetingUrl } from "./common/utils";
import DefaultConfig from "../../server/src/defaultConfig.json";

const SERVER_URL = "http://localhost:8080";

test.describe("tests for visit with meeting url:", () => {
  test.beforeEach(async ({ page }) => {
    const url = buildUrl(SERVER_URL, "visit", testMeetingUrl);
    await page.goto(url);
  });

  test("navigating to visit with meeting URL", async ({ page }) => {
    //Wait for page to load
    await expect(
      page.locator('[data-icon-name="Waffle"]').first()
    ).toBeVisible();
    await expect(page.locator('text="Start a call"').first()).toBeVisible();
    await expect(page.locator('text="Start call"').first()).toBeVisible();
    await page.locator('button:has-text("Start call")').isEnabled;
    await delay(DELAY_MS);
    expect(await page.screenshot()).toMatchSnapshot("startCallScreenshot.png");

    //Start the call
    await page.locator('button:has-text("Start call")').click();

    //Wait for lobby page to load
    const subtitle = DefaultConfig.waitingSubtitle;
    const title = DefaultConfig.waitingTitle;
    await expect(
      page.locator('[data-icon-name="Waffle"]').first()
    ).toBeVisible();
    await expect(page.locator(`text='${title}'`).first()).toBeVisible();
    await expect(page.locator(`text='${subtitle}'`).first()).toBeVisible();
    await delay(DELAY_MS);
    expect(await page.screenshot()).toMatchSnapshot("lobbyScreenshot.png");

    //Leave Call
    await page
      .locator("[data-ui-id=call-composite-hangup-button]")
      .first()
      .click();

    //Wait for rejoin call page to load
    await expect(
      page.locator('[data-icon-name="Waffle"]').first()
    ).toBeVisible();
    await expect(
      page.locator('text="You left the call"').first()
    ).toBeVisible();
    await delay(DELAY_MS);
    expect(await page.screenshot()).toMatchSnapshot("endCallScreenshot.png");
  });
});
