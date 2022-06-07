import { expect } from "@playwright/test";
import { test } from "./fixture";

test.describe("tests:", () => {
  test("navigating to book", async ({ serverUrl, page }) => {
    await page.goto(serverUrl);
    await page.frameLocator("iframe").locator(".headerSection").isVisible;
  });
});
