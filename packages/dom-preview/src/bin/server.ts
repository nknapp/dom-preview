#!/usr/bin/env/node

import { getUiRootFolder } from "@dom-preview/ui";
import { runDomPreviewServer } from "@dom-preview/server";
import { logError } from "@dom-preview/ui/src/utils/logger";
import { serverPort } from "../config/serverPort";

runDomPreviewServer({
  port: serverPort,
  staticFilesDir: getUiRootFolder(),
}).catch(logError);
