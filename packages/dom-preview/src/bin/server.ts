#!/usr/bin/env/node

import { getUiRootFolder } from "@dom-preview/ui";
import { runDomPreviewServer } from "@dom-preview/server";
import { serverPort } from "../config/serverPort";

runDomPreviewServer({
  port: serverPort,
  staticFilesDir: getUiRootFolder(),
}).catch((error) => {
  // eslint-disable-next-line no-console
  console.error(`Unexpected error: ${error}`);
  process.exit(1);
});
