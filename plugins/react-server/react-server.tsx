import { MiddlewareConfigMap, Routes, serverFactory } from "bnkit/server";
import { createReactStreamHandler } from "./react-dom-stream-handler";

export const createReactServerRoutes = async <MiddlewareConfig extends MiddlewareConfigMap, State extends object>({
  Component,
  buildPath = "/build/",
  fileBuildName = "app.js",
}: {
  Component: React.ReactNode;
  middlewareConfig?: MiddlewareConfig;
  buildPath?: string;
  fileBuildName?: string;
}) => {
  // change ./ to just / for buildEntry

  const routes: Routes<MiddlewareConfig> = {
    "/": {
      get: await createReactStreamHandler({
        // idea pass middleware to renderNode and access data on client
        renderNode: Component,
        entryPath: buildPath + fileBuildName,
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

export const reactServer = async <AppStateT extends object = {}>({
  Entry,
  port = 3000,
  buildPath = "/build/",
  fileBuildName = "app.js",
}: {
  Entry: React.ReactNode;
  port?: number;
  appState?: AppStateT;
  buildPath?: string;
  fileBuildName?: string;
  // serve: typeof Bun.serve;
}) => {
  // ssr everything and use a server side state manager to handle all interactions
  const middlewareConfig = {
    //   time: (req: Request) => {
    //     return {
    //       timestamp: new Date(),
    //     };
    //   },
  } satisfies MiddlewareConfigMap;

  const { start } = serverFactory({
    serve: Bun.serve,
    // serve,
    routes: await createReactServerRoutes({
      middlewareConfig,
      Component: Entry,
      buildPath: buildPath,
      fileBuildName: fileBuildName,

    }),

    // todo implement middleware
    // middlewareControl: middlewareFactory(middlewareConfig),
  });

  start(port);
};
