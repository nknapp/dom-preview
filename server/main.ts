import http, { IncomingMessage } from "node:http";
import { RouteMatcher } from "./router/router";
import { pipeline } from "node:stream/promises";
import { buffer } from "node:stream/consumers";
import { DomPreview } from "@/model/DomPreview";
import { createUiHandler } from "@server/router/deliver-ui";
import { pipeResponse } from "@server/utils/pipeResponse";

// Virtual file structure
// GET /__preview__/{context}/{count}
// POST /__preview__/{context}

export async function startServer(port: number) {
  const domPreviews: Record<string, DomPreview[]> = {};

  const matchers: Record<string, RouteMatcher> = {
    get: new RouteMatcher(),
    post: new RouteMatcher(),
  };
  matchers.get.add("/__preview__/{context}/{count}", async (req, params) => {
    return Response.json(domPreviews[params.context][Number(params.count)]);
  });

  matchers.post.add("/__preview__/{context}", async (req, params) => {
    const body = await buffer(req);
    // TODO: extract store, save to disc
    const parsedBody = JSON.parse(body.toString("utf-8"));
    domPreviews[params.context] = domPreviews[params.context] || [];
    domPreviews[params.context].push(parsedBody);
    return Response.json({ success: true });
  });

  const uiHandler = createUiHandler();

  async function handleRequest(req: IncomingMessage): Promise<Response> {
    if (req.method == null) {
      return Response.json(
        { error: "no method" },
        { status: 400, statusText: "No method found" },
      );
    }
    const uiResponse = await uiHandler(req);
    if (uiResponse != null) {
      return uiResponse;
    }
    let method = req.method.toLowerCase();
    const matcher = matchers[method];
    if (matcher == null)
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    if (req.url == null)
      return Response.json({ error: "Request has no method" }, { status: 400 });

    const match = matcher.match(req.url);
    try {
      return await match.handler(req, match.params);
    } catch (error) {
      console.error(error);
      return Response.json(
        { error: "Internal Server Error" },
        { status: 500, statusText: "Internal Server Error" },
      );
    }
  }

  const server = http.createServer(async (req, res) => {
    pipeResponse(await handleRequest(req), res);
  });

  server.listen(port);
  await new Promise((resolve) => {
    server.once("listening", resolve);
  });

  return {
    stop() {
      server.close();
    },
  };
}
