import {
  asReqResHandler,
  ReqResHandler,
  WebResponseHandler,
} from "@server/utils/asReqResHandler";
import { Handler, Params } from "@server/router/types";
import { IncomingMessage, ServerResponse } from "node:http";
import { logError } from "@server/utils/logger";
import { compileRoute } from "@server/router/compileRoute";

const methods = ["GET", "POST"] as const;
type Method = (typeof methods)[number];
type HandlersForMethod<T extends string> = Partial<Record<Method, Handler<T>>>;

function isMethod(value: string | null | undefined): value is Method {
  return methods.includes(value as Method);
}

interface RouteDefinition<T extends string> {
  pattern: T;
  matcher: RegExp;
  methods: HandlersForMethod<T>;
}

export class Router {
  private routes: RouteDefinition<string>[] = [];

  readonly handleRequest: ReqResHandler;

  constructor() {
    this.handleRequest = asReqResHandler(this.findAndRunHandler.bind(this));
  }

  get<T extends string>(pattern: T, handler: Handler<T>) {
    let route = this.lazyGetRoute(pattern);
    route.methods["GET"] = handler as Handler<string>;
  }

  post<T extends string>(pattern: T, handler: Handler<T>) {
    let route = this.lazyGetRoute(pattern);
    route.methods["POST"] = handler as Handler<string>;
  }

  private lazyGetRoute<T extends string>(pattern: T) {
    let route = this.routes.find((route) => route.pattern === pattern);
    if (route == null) {
      route = {
        matcher: compileRoute(pattern),
        methods: {},
        pattern,
      };
      this.routes.push(route);
    }
    return route;
  }

  async findAndRunHandler(req: IncomingMessage): Promise<Response> {
    const url = req.url;
    if (url == null) {
      logError("Request without URL");
      return errorResponse(400, "Bad request");
    }
    const method = req.method;
    if (!isMethod(method)) {
      logError("Request without method");
      return errorResponse(400, "Bad request");
    }

    for (const route of this.routes) {
      const match = route.matcher.exec(url);
      if (match != null) {
        const handler = route.methods[method];
        if (handler == null) {
          return errorResponse(405, "Method Not Allowed");
        }
        return handler(req, match.groups!);
      }
    }
    return errorResponse(404, "Not found");
  }
}

function errorResponse(status: number, statusText: string) {
  return new Response(statusText, { status, statusText });
}
