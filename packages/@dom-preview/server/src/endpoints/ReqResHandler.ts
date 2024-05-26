import { IncomingMessage, ServerResponse } from "node:http";

export type ReqResOptions = {
  req: IncomingMessage;
  res: ServerResponse;
  params?: Record<string, string>;
};

export type ReqResHandler = (options: ReqResOptions) => void;
