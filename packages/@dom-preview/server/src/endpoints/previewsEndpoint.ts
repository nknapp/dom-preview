import { DomPreviewStore } from "../store/DomPreviewStore.js";
import { ReqResHandler } from "./ReqResHandler.js";
import { asReqResHandler } from "../utils/asReqResHandler.js";
import { buffer } from "node:stream/consumers";
import { DomPreviewValidator } from "../model/DomPreview.js";

export function createPreviewsEndpoint(store: DomPreviewStore): ReqResHandler {
  return asReqResHandler(async (request) => {
    const body = await buffer(request);
    const parsedBody = JSON.parse(body.toString("utf-8"));
    const validatedBody = DomPreviewValidator.safeParse(parsedBody);
    if (!validatedBody.success) {
      return new Response(
        JSON.stringify({
          message: "Invalid JSON",
          issues: validatedBody.error.issues,
        }),
        { status: 400 },
      );
    }

    store.addDomPreview(validatedBody.data);
    return new Response("", { status: 201 });
  });
}
