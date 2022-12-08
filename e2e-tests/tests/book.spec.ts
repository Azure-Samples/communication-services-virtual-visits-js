// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect, test } from "@playwright/test";
import { buildUrl } from "./common/utils";

const SERVER_URL = "http://localhost:8080";

test.describe("tests:", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(buildUrl(SERVER_URL, "book"));
  });

  test("navigating to book", async ({ page }) => {
    await expect(
      page.locator('[data-icon-name="Waffle"]').first()
    ).toBeVisible();
    await expect(
      page.locator('[id="BookMeetingSection"]').first()
    ).toBeVisible();
  });

  test("navigating to visit using waffle menu", async ({ page }) => {
    const waffle = page.locator('[data-icon-name="Waffle"]').first();
    await waffle.click();

    // Click text=Visit
    await page.locator("text=Visit").click();
    await expect(page).toHaveURL(buildUrl(SERVER_URL, "visit"));
  });
});
