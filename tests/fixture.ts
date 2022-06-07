import { test as base } from "@playwright/test";
import path from "path";
import { createTestServer } from "./server";

const SERVER_URL = "http://localhost:8080";
const APP_DIR = path.join(__dirname, "app");

export interface ServerStartFixture {
  serverUrl: string;
}

export const test = base.extend<unknown, ServerStartFixture>({
  /** @returns string URL for the server. */
  serverUrl: [
    createTestServer({ appDir: APP_DIR, serverUrl: SERVER_URL }),
    { scope: "worker" },
  ],
});
