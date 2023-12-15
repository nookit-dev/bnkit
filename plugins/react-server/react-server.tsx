import { MiddlewareConfigMap, Routes, serverFactory } from "bnkit/server";
import { createReactStreamHandler } from "./react-dom-stream-handler";

export const createReactServerRoutes = async <MiddlewareConfig extends MiddlewareConfigMap, State extends object>({
  Component,
  buildPath = "/build/",
}: {
  Component: React.ReactNode;
  buildPath?: string;
}) => {
  // change ./ to just / for buildEntry

  const routes
    = {
    "/": {
      get: await createReactStreamHandler({
        // idea pass middleware to renderNode and access data on client
        renderNode: Component,
        entryPath: buildPath,
      }),
    },
    "^/build/.+": {
      get: () => {
        return new Response(Bun.file(buildPath).stream(), {
          headers: {
            "Content-Type": "application/javascript",
          },
        });
      },
    },
  };

  return routes;
};

export const reactServer = async ({
  Entry,
  port = 3000,
  buildPath
}: {
  Entry: React.ReactNode;
  port?: number;
  buildPath?: string;
}) => {

  const { start } = serverFactory({
    serve: Bun.serve,
    // serve,
    routes: await createReactServerRoutes({
      Component: Entry,
      buildPath

    }),

  });

  start(port);
};

