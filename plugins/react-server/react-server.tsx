import Bun from "bun";
import { createReactServerRoutes } from "./create-react-server-routes";
import { MiddlewareConfigMap, serverFactory } from "../../modules/server";


export const reactServer = async <AppStateT extends object = {}>({
  Entry,
  appState = {} as AppStateT,
  port = 3000,
  buildPath = "/build/app.js",
}: {
  Entry: React.ReactNode;
  port?: number;
  appState?: AppStateT;
  buildPath?: string;
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
    routes: await createReactServerRoutes({
      middlewareConfig,
      Component: Entry,
      appState,
      buildEntry: buildPath,
    }),

    // todo implement middleware
    // middlewareControl: middlewareFactory(middlewareConfig),
  });

  start(port);
};
