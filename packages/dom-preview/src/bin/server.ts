#!/usr/bin/env/node
/* eslint-disable no-console */

import { getUiRootFolder } from "@dom-preview/ui";
import { runDomPreviewServer } from "@dom-preview/server";
import { serverPort } from "../config/serverPort";
import { parseArgs } from "node:util";
import {
  DocumentedParseArgsOptionsConfig,
  showHelpAndExit,
} from "../utils/cliHelper";

const options = {
  "proxy-to": {
    type: "string",
    description: `
      Forward requests non '/__dom-preview__/' to another backend.
      Typically this is the dev-server of your build-chain (e.g. vite)`,
  },
  help: {
    type: "boolean",
    description: `Shows this help`,
  },
} satisfies DocumentedParseArgsOptionsConfig;

const args = parseArgs({ options });

if (args.values.help) {
  showHelpAndExit(options);
}

runDomPreviewServer({
  port: serverPort,
  staticFilesDir: getUiRootFolder(),
  proxyUnknownRequestsTo: args.values["proxy-to"],
}).catch((error) => {
  // eslint-disable-next-line no-console
  console.error(`Unexpected error: ${error}`);
  process.exit(1);
});
