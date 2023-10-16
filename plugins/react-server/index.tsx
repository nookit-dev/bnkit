import {
  InferMiddlewareDataMap,
  RouteHandler,
  Routes,
  jsonRes,
  middlewareFactory,
  serverFactory,
} from "@bnk/core/modules/server";
import { Base, SomeClientThingy } from "base";
import Bun from "bun";
import React from "react";
import { renderToReadableStream } from "react-dom/server";
// import { App } from "./src/app";

function App() {
  // const
  // React.useEffect(() => {
  //   setTimeout(() => {
  //     console.log("Hello, React!");
  //   }, 1000);
  // }, []);

  // console.log({
  //   window: typeof window,
  // });

  return <SomeClientThingy />;
}

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
  // publicPath: "./build",
});

const indexOutput = builds.outputs[0].path.split("/").pop() as string;

// console.log(
//   {
//     indexOutput,
//   },
//   builds.outputs[0]
// );

// const indexContent = await Bun.write(
//   "./src/index.html",
//   htmlTemplate({
//     entryFilePath: outFile,
//   })
// );

// const buildFile =

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
  console.log({ isServer });
  return (
    <Base entryFilePath={"/build/base.js"}>
      {/* <App /> */}
      <SomeClientThingy />
    </Base>
  );
};
const test = "test"
const test2 = "test22"


// const htmlFile = await renderToString(<RenderApp />);

// write base html file
// await Bun.write("./build/index.html", htmlFile);

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
    POST: (req) => {
      return jsonRes({});
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
  // "/app.js": {
  //   GET: () => {
  //     return new Response(Bun.file("./build/base.js").stream(), {
  //       headers: {
  //         "Content-Type": "application/javascript",
  //       },
  //     });
  //   },
  // },
};

const { start } = serverFactory({
  routes,
  middlewareControl: middlewareFactory(middlewareConfig),
});

// };

// const { filePaths } = await buildBundle();
// const cssFiles = filePaths.cssFiles;

// const pageBuilder = createPageBuilder({
//   buildDir: BUILD_DIR,
//   paths: {
//     scriptPaths: [JS_ENTRY_FILE],
//     stylePaths: cssFiles,
//   },
// });

// pageBuilder.generateHtmlFile();

// start();
start();
