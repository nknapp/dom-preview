import { IncomingMessage, ServerResponse } from "node:http";

export type ReqResOptions = {
  req: IncomingMessage;
  res: ServerResponse;
};

export type ReqResHandler = (options: ReqResOptions) => void;
