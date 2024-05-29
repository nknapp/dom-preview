import { ReqResHandler } from "./ReqResHandler.js";
import { DomPreviewStore } from "../store/DomPreviewStore.js";

export function createDeleteAllPreviewsHandler(
  store: DomPreviewStore,
): ReqResHandler {
  return ({ res }) => {
    store.clear();
    res.statusCode = 204;
    res.end();
  };
}
