import { IncomingMessage } from "node:http";
import { pipeResponse } from "./pipeResponse.js";
import { logError } from "./logger.js";
import { ReqResHandler } from "../endpoints/ReqResHandler.js";

export type WebResponseHandler = (
  res: IncomingMessage,
) => Promise<Response | null>;

export function asReqResHandler(handler: WebResponseHandler): ReqResHandler {
  return async ({ req, res }) => {
    try {
      const webResponse = await handler(req);
      assertNotNull(webResponse);
      pipeResponse(webResponse, res);
    } catch (error) {
      res.statusCode = 500;
      res.statusMessage = "Internal Server Error";
      res.end("");
      logError(error);
    }
  };
}

function assertNotNull(
  response: Response | null,
): asserts response is Response {
  if (response == null) {
    throw new Error("Response is null");
  }
}
