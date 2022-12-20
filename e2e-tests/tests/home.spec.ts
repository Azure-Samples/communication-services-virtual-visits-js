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

  // Click button:has-text("Start as Presenter")
  const startAsPresenterBtn = 'button:has-text("Start as Presenter")';
  await page.locator(startAsPresenterBtn).isEnabled();
  await page.locator(startAsPresenterBtn).click();

  // Click button:has-text("Start call")
  await expect(page.locator('[data-icon-name="Waffle"]').first()).toBeVisible();
  await expect(page.locator('text="Start call"').first()).toBeVisible();
  await page.locator('button:has-text("Start call")').isEnabled();
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
