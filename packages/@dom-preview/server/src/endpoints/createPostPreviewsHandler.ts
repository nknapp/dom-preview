import { DomPreviewStore } from "../store/DomPreviewStore.js";
import { ReqResHandler } from "./ReqResHandler.js";
import { asReqResHandler } from "../utils/asReqResHandler.js";
import { buffer } from "node:stream/consumers";
import {
  DomPreviewCreate,
  DomPreviewCreateModel,
} from "../model/DomPreview.js";

export interface CreatePreviewResponse {
  id: string;
}

export function createPostPreviewsHandler(
  store: DomPreviewStore,
): ReqResHandler {
  return asReqResHandler(async (request) => {
    const body = await buffer(request);
    const parsedBody = JSON.parse(body.toString("utf-8"));
    const validatedBody = DomPreviewCreateModel.safeParse(parsedBody);
    if (!validatedBody.success) {
      return new Response(
        JSON.stringify({
          message: "Invalid JSON",
          issues: validatedBody.error.issues,
        }),
        { status: 400 },
      );
    }

    const domPreview: DomPreviewCreate = validatedBody.data;
    const { id } = store.addDomPreview(domPreview);
    return new Response(JSON.stringify({ id }), { status: 201 });
  });
}
