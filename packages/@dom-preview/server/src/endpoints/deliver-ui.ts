import sirv from "sirv";
import { ReqResHandler } from "./ReqResHandler.js";

export function createUiHandler(uiBaseDir: string): ReqResHandler {
  const serveStaticFiles = sirv(uiBaseDir);
  return (req, res) => {
    if (req.method !== "GET") {
      res.statusCode = 405;
      res.setHeader("content-type", "text/plain");
      res.write(`Method Not Allowed: ${req.method}`);
      return;
    } else {
      return serveStaticFiles(req, res);
    }
  };
}
