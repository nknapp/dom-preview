import { ReqResHandler } from "./ReqResHandler.js";
import { DomPreviewStore } from "../store/DomPreviewStore.js";

export function createDeleteAllPreviewsHandler(
  store: DomPreviewStore,
): ReqResHandler {
  return ({ req, res }) => {
    store.clear();
    res.end("");
  };
}
