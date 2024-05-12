import { Router } from "../router/Router";
import { buffer } from "node:stream/consumers";
import { DomPreviewStore } from "../store/DomPreviewStore";
import { ReqResHandler } from "../utils/asReqResHandler";

export function createApi(store: DomPreviewStore): ReqResHandler {
  const api = new Router();
  api.get("/api/previews/{context}/{count}", async (req, params) => {
    return Response.json(
      store.domPreviews[params.context][Number(params.count)],
    );
  });

  api.post("/api/previews/", async (req) => {
    const body = await buffer(req);
    const parsedBody = JSON.parse(body.toString("utf-8"));
    store.addDomPreview(parsedBody);
    return Response.json({ success: true });
  });

  return api.handleRequest;
}
