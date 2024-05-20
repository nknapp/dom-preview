#!/usr/bin/env/node

import { getUiRootFolder } from "@dom-preview/ui";
import { runDomPreviewServer } from "@dom-preview/server";

runDomPreviewServer({
  port: 1234,
  staticFilesDir: getUiRootFolder(),
}).catch(console.error);
