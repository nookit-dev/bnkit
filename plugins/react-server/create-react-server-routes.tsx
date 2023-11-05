import { MiddlewareConfigMap, Routes, jsonRes } from "@bnk/core/modules/server";
import { createReactStreamHandler } from "./react-dom-stream-handler";

export const createReactServerRoutes = async <
  MiddlewareConfig extends MiddlewareConfigMap,
  State extends object
>({
  Component,
  appState,
  middlewareConfig,
  buildEntry = "./build/app.js",
  fileBuildName = "app.js",
}: {
  Component: React.ReactNode;
  middlewareConfig?: MiddlewareConfig;
  appState?: State;
  buildEntry?: string;
  fileBuildName?: string;
}) => {
  // change ./ to just / for buildEntry
  const cleanedBuildEntry = buildEntry.replace("./", "/");

  const routes: Routes<MiddlewareConfig> = {
    "/": {
      GET: await createReactStreamHandler({
        // idea pass middleware to renderNode and access data on client
        renderNode: Component,
      }),
    },
    "/state": {
      POST: async (req) => {
        try {
          const stateUpdate = (await req.json()) as {
            type: "partial" | "full";
            // partial is one key/value pair
            state: Partial<State>;
          };

          if (stateUpdate.type === "partial") {
            const key = Object.keys(stateUpdate.state)[0];
            const value = Object.values(stateUpdate.state)[0];

            appState[key as keyof State] = value;
          }

          return jsonRes({
            state: appState,
            type: stateUpdate.type,
            status: "success",
          });
        } catch (e) {
          console.error(e);
          return new Response("Invalid JSON", {
            status: 400,
          });
        }
      },
      GET: (req) => {
        if (!appState) new Response("No state", { status: 400 });
        return jsonRes(appState || {});
      },
    },
    ["/" + fileBuildName]: {
      GET: () => {
        return new Response(Bun.file(buildEntry).stream(), {
          headers: {
            "Content-Type": "application/javascript",
          },
        });
      },
    },
    [cleanedBuildEntry]: {
      GET: () => {
        return new Response(Bun.file(buildEntry).stream(), {
          headers: {
            "Content-Type": "application/javascript",
          },
        });
      },
    },
  };

  return routes;
};
