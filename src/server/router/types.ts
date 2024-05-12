import { IncomingMessage } from "node:http";

export type Params<Pattern extends string> =
  Pattern extends `${string}{${infer Param}}${infer Rest}`
    ? Param | Params<Rest>
    : never;

export type Handler<Pattern extends string> = (
  req: IncomingMessage,
  params: Record<Params<Pattern>, string>,
) => Promise<Response> | Response;
