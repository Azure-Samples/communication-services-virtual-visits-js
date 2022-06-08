import { test as base } from "@playwright/test";
import { createTestServer } from "./server";

/* This file is not required if following approach 1 */

const SERVER_URL = "http://localhost:8080";

export interface ServerStartFixture {
  serverUrl: string;
}

export const test = base.extend<unknown, ServerStartFixture>({
  /** @returns string URL for the server. */
  serverUrl: [createTestServer({ serverUrl: SERVER_URL }), { scope: "worker" }],
});
