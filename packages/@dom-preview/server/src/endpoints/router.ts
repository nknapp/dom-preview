import { ReqResHandler } from "../utils/asReqResHandler.js";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type Route = `${Method} /${string}`;
type EndPoints = Record<Route | "*", ReqResHandler>;

export function createSimpleRouter(endpoints: EndPoints): ReqResHandler {
  return (req, res) => {
    const methodAndPath = `${req.method} ${req.url}` as Route;
    const handler = endpoints[methodAndPath] ?? endpoints["*"];
    handler(req, res);
  };
}
