import { ReqResHandler } from "@server/utils/asReqResHandler";
import sirv from "sirv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pipeResponse } from "@server/utils/pipeResponse";

export function createUiHandler(): ReqResHandler {
  const uiDir = path.resolve(
    fileURLToPath(import.meta.url),
    "..",
    "..",
    "ui",
    "dist",
  );
  const serveStaticFiles = sirv(uiDir);
  return (req, res) => {
    if (req.method !== "GET") {
      pipeResponse(new Response("Method Not Allowed", { status: 405 }), res);
      return;
    }
    return serveStaticFiles(req, res);
  };
}
