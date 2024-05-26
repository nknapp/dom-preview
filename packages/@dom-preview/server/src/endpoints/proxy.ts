import { ReqResHandler } from "./ReqResHandler.js";
import { logError } from "../utils/logger.js";
import http, { IncomingMessage } from "node:http";
import { pipeline } from "node:stream/promises";

const allowedHostnames = new Set(["localhost", "127.0.0.1"]);
const allowedProtocols = new Set(["http:"]);

export function createProxy(baseUrl: string): ReqResHandler {
  const url = new URL(baseUrl);

  if (!allowedHostnames.has(url.hostname)) {
    throw new Error("Only proxying to 'http://localhost/*' is supported.");
  }
  if (!allowedProtocols.has(url.protocol)) {
    throw new Error("Only proxying to 'http://localhost/*' is supported.");
  }
  return async ({ req, res }) => {
    try {
      const headers = unwrapSingleItemArrays(req.headersDistinct);

      const backendResponse = await new Promise<IncomingMessage>((resolve) => {
        http.get(baseUrl + req.url, { method: req.method, headers }, resolve);
      });
      const backendHeaders = backendResponse.headersDistinct;
      for (const [name, values] of Object.entries(backendHeaders)) {
        if (values == null) continue;
        res.setHeader(name, values);
      }

      await pipeline(backendResponse, res);
    } catch (error) {
      logError(`Error proxying request ${req.method} ${req.url}`, error);
      res.statusCode = 500;
      res.end("error");
    }
  };
}

/**
 * Converts values of the objects:
 * * Arrays of length 1 become their item (without the array)
 * * Longer arrays are kept
 * * Arrays of length 0 become undefined
 * @param object
 */
function unwrapSingleItemArrays<T>(
  object: Record<string, T[] | undefined>,
): Record<string, T | T[] | undefined> {
  const headers: Record<string, T | T[] | undefined> = {};
  for (const [name, value] of Object.entries(object)) {
    headers[name] = unwrapSingleItemArray(value);
  }
  return headers;
}

function unwrapSingleItemArray<T>(item: T[] | undefined): T | T[] | undefined {
  if (item == null) return undefined;
  if (item.length === 0) return undefined;
  if (item.length === 1) return item[0];
  return item;
}
