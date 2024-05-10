import { Server, ServerResponse } from "node:http";
import { Readable } from "node:stream";
import { ReadableStream } from "node:stream/web";

export function pipeResponse(
  webResponse: Response,
  serverResponse: ServerResponse,
) {
  serverResponse.statusCode = webResponse.status;
  serverResponse.statusMessage = webResponse.statusText;
  webResponse.headers.forEach((value, name) => {
    serverResponse.appendHeader(name, value);
  });
  if (webResponse.body == null) {
    serverResponse.end();
    return;
  }
  Readable.fromWeb(webResponse.body as ReadableStream).pipe(serverResponse);
}
