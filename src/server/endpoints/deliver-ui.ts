import { ReqResHandler } from "../utils/asReqResHandler";
import sirv from "sirv";
import { pipeResponse } from "../utils/pipeResponse";

export function createUiHandler(uiBaseDir: string): ReqResHandler {
  const serveStaticFiles = sirv(uiBaseDir);
  return (req, res) => {
    if (req.method !== "GET") {
      pipeResponse(new Response("Method Not Allowed", { status: 405 }), res);
      return;
    }
    return serveStaticFiles(req, res);
  };
}
