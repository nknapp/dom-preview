import { IncomingMessage, ServerResponse } from "node:http";

export type ReqResHandler = (res: IncomingMessage, req: ServerResponse) => void;
