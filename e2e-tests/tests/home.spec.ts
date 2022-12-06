// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { test, expect } from "@playwright/test";
import { delay, DELAY_MS } from "./common/utils";

const SERVER_URL = "http://localhost:8080";

test("root page test", async ({ page }) => {
  // Go to http://localhost:8080/
  await page.goto(SERVER_URL);

  await expect(page.locator('[data-icon-name="Waffle"]').first()).toBeVisible();

  await delay(DELAY_MS);
  expect(await page.screenshot()).toMatchSnapshot("homeScreenshot.png");

  // Click button:has-text("Start a call")
  await page.locator('button:has-text("Start a call")').isEnabled();
  await page.locator('button:has-text("Start a call")').click();

  // Click button[role="menuitem"]:has-text("as host (presenter)")
  await page
    .locator('button[role="menuitem"]:has-text("as host (presenter)")')
    .click();
  await delay(DELAY_MS);

  // Click button:has-text("Start call")
  await expect(page.locator('[data-icon-name="Waffle"]').first()).toBeVisible();
  await expect(page.locator('text="Start a call"').first()).toBeVisible();
  await expect(page.locator('text="Start call"').first()).toBeVisible();
  await page.locator('button:has-text("Start call")').isEnabled;
  await delay(DELAY_MS);
  expect(await page.screenshot()).toMatchSnapshot(
    "roomsStartCallScreenshot.png"
  );
  await page.locator('button:has-text("Start call")').click();

  // Click [aria-label="Leave call"]
  await page.locator('[aria-label="Leave call"]').click();

  //Wait for rejoin call page to load
  await expect(page.locator('[data-icon-name="Waffle"]').first()).toBeVisible();
  await expect(page.locator('text="Re-join call"').first()).toBeVisible();

  await delay(DELAY_MS);
  expect(await page.screenshot()).toMatchSnapshot("roomsEndCallScreenshot.png");
});
