import { IncomingMessage, ServerResponse } from "node:http";
import { pipeResponse } from "./pipeResponse";
import { logError } from "./logger";

export type WebResponseHandler = (
  res: IncomingMessage,
) => Promise<Response | null>;
export type ReqResHandler = (res: IncomingMessage, req: ServerResponse) => void;

export function asReqResHandler(handler: WebResponseHandler): ReqResHandler {
  return async (req, res) => {
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
