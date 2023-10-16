import {
  InferMiddlewareDataMap,
  RouteHandler,
  Routes,
  jsonRes,
  middlewareFactory,
  serverFactory,
} from "@bnk/core/modules/server";
import { Base } from "base";
import Bun from "bun";
import { renderToReadableStream } from "react-dom/server";
import { App } from "src/app";

// ssr everything and use a server side state manager to handle all interactions
const middlewareConfig = {
  time: (req: Request) => {
    return {
      timestamp: new Date(),
    };
  },
} as const;

// const builds = await Bun.build({
//   entrypoints: ["./src/app.tsx"],
//   target: "browser",
//   minify: {
//     identifiers: true,
//     syntax: true,
//     whitespace: true,
//   },
//   outdir: "./build",
// });

// const outFile = builds.outputs[0].path.split("/").pop() as string;

// const indexContent = await Bun.write(
//   "./src/index.html",
//   htmlTemplate({
//     entryFilePath: outFile,
//   })
// );

// const buildFile =

const RenderApp = () => {
  return (
    <Base entryFilePath={"./app.js"}>
      <App />
    </Base>
  );
};

const res = new Response(await renderToReadableStream(<RenderApp />));

const baseResponse = await res.text();

const file = await Bun.write("./build/index.html", baseResponse);

console.log({
  res,
  htmlText: baseResponse,
  file,
});

const reactServerHandler: RouteHandler<
  InferMiddlewareDataMap<typeof middlewareConfig>
> = async (req, { time }) => {
  // write html file with react script (this shoudl eb done on server startup)
  // });
  // console.log({ builds });
  const stream = await renderToReadableStream(<RenderApp />);
  // ({
  //   entryFilePath: "./base.tsx",
  // })

  return new Response(stream, {
    headers: {
      // html
      "Content-Type": "text/html",
    },
  });
};

// console.log({ outFile });

// console.log({
//   indexContent,
//   buildFile,
// });

const routes: Routes<typeof middlewareConfig> = {
  "/": {
    GET: reactServerHandler,
  },
  "/state": {
    POST: (req) => {
      return jsonRes({});
    },
  },
    // "/app.js": {
  //   GET: () => {
  //     return new Response(Bun.file("./build/app.js").stream(), {
  //       headers: {
  //         "Content-Type": "application/javascript",
  //       },
  //     });
  //   },
  // },
  // "/base.tsx": {
  // GET: reactServerHandler,
  // GET: async (req) => {

  // }
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
