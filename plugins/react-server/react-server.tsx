import { MiddlewareConfigMap, serverFactory } from "@bnk/core/modules/server";
import { createReactServerRoutes } from "./create-react-server-routes";

export const reactServer = async <AppStateT extends object = {}>({
  Entry,
  appState = {} as AppStateT,
  port = 3000,
  buildPath = "/build/app.js",
  serve,
  fileBuildName,
}: {
  Entry: React.ReactNode;
  port?: number;
  appState?: AppStateT;
  buildPath?: string;
  fileBuildName?: string;
  serve: typeof Bun.serve;
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
    serve,
    routes: await createReactServerRoutes({
      middlewareConfig,
      Component: Entry,
      appState,
      buildEntry: buildPath,
      fileBuildName,
    }),

    // todo implement middleware
    // middlewareControl: middlewareFactory(middlewareConfig),
  });

  start(port);
};
