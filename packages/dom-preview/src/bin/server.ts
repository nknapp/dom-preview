#!/usr/bin/env/node

import { getUiRootFolder } from "@dom-preview/ui";
import { runDomPreviewServer } from "@dom-preview/server";
import { logError } from "@dom-preview/ui/src/utils/logger";

runDomPreviewServer({
  port: 1234,
  staticFilesDir: getUiRootFolder(),
}).catch(logError);
