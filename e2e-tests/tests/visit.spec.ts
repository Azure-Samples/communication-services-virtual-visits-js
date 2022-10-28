// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect, test } from "@playwright/test";
import { buildUrl, delay, DELAY_MS, testMeetingUrl } from "./common/utils";
import DefaultConfig from "../../server/src/defaultConfig.json";

const SERVER_URL = "http://localhost:8080";

const testVisitWithMeetingUrl = async (page) => {
  //Wait for page to load
  await expect(page.locator('[data-icon-name="Waffle"]').first()).toBeVisible();
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
  await expect(page.locator('[data-icon-name="Waffle"]').first()).toBeVisible();
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
  await expect(page.locator('[data-icon-name="Waffle"]').first()).toBeVisible();
  await expect(page.locator('text="Continue"').first()).toBeVisible();
  await expect(page.locator('text="Tell us how we did"').first()).toBeVisible();
  await expect(
    page.locator('text="or re-join the call"').first()
  ).toBeVisible();

  await delay(DELAY_MS);
  expect(await page.screenshot()).toMatchSnapshot("endCallScreenshot.png");
};

test.describe("tests for visit:", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(buildUrl(SERVER_URL, "visit"));
  });

  test("navigating to visit", async ({ page }) => {
    await page.isVisible(".JoinTeamsMeetingSection");
    await expect(
      page.locator('[data-icon-name="Waffle"]').first()
    ).toBeVisible();
    await expect(page.locator('text="Join a call"').first()).toBeVisible();
    await expect(page.locator('text="Join call"').first()).toBeVisible();
    await page.locator('button:has-text("Join call")').isEnabled;
    await delay(DELAY_MS);
    expect(await page.screenshot()).toMatchSnapshot("visitScreenshot.png");

    // Click [placeholder="Enter a meeting link"]
    await page.locator('[placeholder="Enter a meeting link"]').click();

    // Fill Meeting link
    await page
      .locator('[placeholder="Enter a meeting link"]')
      .fill(testMeetingUrl);

    // Click "Join call"
    await page.locator('button:has-text("Join call")').click();
    await expect(page).toHaveURL(
      `visit?meetingURL=${encodeURIComponent(testMeetingUrl)}`
    );

    await testVisitWithMeetingUrl(page);
  });
});

test.describe("tests for visit with meeting url:", () => {
  test.beforeEach(async ({ page }) => {
    const url = buildUrl(SERVER_URL, "visit", testMeetingUrl);
    await page.goto(url);
  });

  test("navigating to visit with meeting URL", async ({ page }) => {
    await testVisitWithMeetingUrl(page);
  });
});
