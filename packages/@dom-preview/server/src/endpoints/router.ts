import { ReqResHandler } from "../utils/asReqResHandler.js";

export type PathPrefix = `/${string}/` | "*";
export type PathPrefixEndpoints = Record<PathPrefix, ReqResHandler>;

export function createPrefixRouter(
  endpoints: PathPrefixEndpoints,
): ReqResHandler {
  const { "*": fallback, ...rest } = endpoints;
  const prefixEndpoints = Object.entries(rest).map(([prefixPath, handler]) => {
    return {
      prefixPath,
      handler,
    };
  });

  function findPrefixEndpoint(path: string | undefined) {
    if (path == null) return;
    return prefixEndpoints.find(({ prefixPath }) => {
      return path.startsWith(prefixPath);
    });
  }

  return (req, res): void => {
    const prefixEndpoint = findPrefixEndpoint(req.url);
    if (prefixEndpoint == null) {
      return fallback(req, res);
    }
    req.url = "/" + req.url?.substring(prefixEndpoint.prefixPath.length);
    return prefixEndpoint.handler(req, res);
  };
}

export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type Route = `${Method} /${string}`;
export type EndPoints = Record<Route | "*", ReqResHandler>;

export function createSimpleRouter(endpoints: EndPoints): ReqResHandler {
  const { "*": fallback, ...rest } = endpoints;

  return (req, res) => {
    const methodAndPath = `${req.method} ${req.url}` as Route;
    const handler = rest[methodAndPath] ?? fallback;
    handler(req, res);
  };
}
