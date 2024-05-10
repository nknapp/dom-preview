import { IncomingMessage, ServerResponse } from "node:http";

export function getStaticFiles() {
  const entries = Object.entries(
    import.meta.glob("../ui/dist/**/*", {
      eager: true,
      query: "raw",
      import: "default",
    }),
  );
  const mappedEntries = entries.map(([name, contents]) => {
    return [name.replace("../ui/dist", ""), contents];
  });
  let result = Object.fromEntries(mappedEntries);
  result["/"] = result["/index.html"];
  return result;
}

export function createUiHandler() {
  const staticFiles = getStaticFiles();
  return async (req: IncomingMessage): Promise<Response | null> => {
    if (req.url == null || staticFiles[req.url] == null) return null;
    switch (req.method) {
      case "GET":
        return new Response(staticFiles[req.url]);
      default:
        return new Response("Method not allowed", {
          status: 405,
          statusText: "Method not allowed",
        });
    }
  };
}
