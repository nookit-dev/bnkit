import {
  InferMiddlewareDataMap,
  RouteHandler,
  Routes,
  jsonRes,
  middlewareFactory,
  serverFactory,
} from "@bnk/core/modules/server";
import Bun from "bun";
import React from "react";
import { renderToReadableStream } from "react-dom/server";
import { AppEntry, Base, appState, getAppState } from "./base";

// ssr everything and use a server side state manager to handle all interactions
const middlewareConfig = {
  time: (req: Request) => {
    return {
      timestamp: new Date(),
    };
  },
} as const;

const builds = await Bun.build({
  entrypoints: ["./base.tsx"],
  target: "browser",
  minify: {
    identifiers: true,
    syntax: true,
    whitespace: true,
  },
  outdir: "./build",
});

const indexOutput = builds.outputs[0].path.split("/").pop() as string;

const isServer = () => {
  return typeof window === "undefined";
};

const useIsServer = () => {
  const [server, setServer] = React.useState(isServer());

  React.useEffect(() => {
    setServer(isServer());
  }, []);

  return server;
};

const RenderApp = () => {
  const isServer = useIsServer();
  return (
    <Base entryFilePath={"/build/base.js"}>
      <AppEntry defaultState={{ ...getAppState() }} />
      {isServer}
    </Base>
  );
};

const reactServerHandler: RouteHandler<
  InferMiddlewareDataMap<typeof middlewareConfig>
> = async (req, { time }) => {
  const stream = await renderToReadableStream(<RenderApp />, {
    bootstrapScripts: ["./build/base.js"],
  });

  return new Response(stream, {
    headers: {
      // html
      "Content-Type": "text/html",
    },
  });
};

const routes: Routes<typeof middlewareConfig> = {
  "/": {
    GET: reactServerHandler,
  },
  "/state": {
    POST: async (req) => {
      let parsedJson: object = {};

      try {
        const stateUpdate = (await req.json()) as {
          type: "partial" | "full";
          // partial is one key/value pair
          state: Partial<typeof appState>;
        };

        console.log({ stateUpdate, appState });

        if (stateUpdate.type === "partial") {
          const key = Object.keys(stateUpdate.state)[0];
          const value = Object.values(stateUpdate.state)[0];

          appState[key as keyof typeof appState] = value;
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
      return jsonRes(appState);
    },
  },
  "/build/base.js": {
    GET: () => {
      return new Response(Bun.file("./build/base.js").stream(), {
        headers: {
          "Content-Type": "application/javascript",
        },
      });
    },
  },
};

const { start } = serverFactory({
  routes,
  middlewareControl: middlewareFactory(middlewareConfig),
});

start();
