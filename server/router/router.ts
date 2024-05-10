import { ServerResponse, IncomingMessage } from "node:http";
import { compileRoute } from "@server/router/compileRoute";

type Params<Pattern extends string> =
  Pattern extends `${string}{${infer Param}}${infer Rest}`
    ? Param | Params<Rest>
    : never;

type Handler<Pattern extends string> = (
  req: IncomingMessage,
  params: Record<Params<Pattern>, string>,
) => Promise<Response>;

interface MatchResult<Pattern extends string> {
  params: Record<Params<Pattern>, string>;
  handler: Handler<Pattern>;
}

export class NotFoundError extends Error {
  readonly url: string;
  constructor(url: string) {
    super(`No handler found for url "${url}"`);
    this.url = url;
  }
}

export class RouteMatcher {
  regex: RegExp[] = [];
  handler: Handler<never>[] = [];

  constructor() {}

  add<Pattern extends string>(pattern: Pattern, handler: Handler<Pattern>) {
    this.regex.push(compileRoute(pattern));
    this.handler.push(handler as Handler<never>);
  }

  match<Pattern extends string>(url: string): MatchResult<Pattern> {
    for (let i = 0; i < this.regex.length; i++) {
      const match = this.regex[i].exec(url);
      if (match != null) {
        return {
          handler: this.handler[i],
          params: match.groups as Record<Params<Pattern>, string>,
        };
      }
    }
    throw new NotFoundError(url);
  }
}
