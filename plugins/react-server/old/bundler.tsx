import Bun from "bun"
import { statSync } from "fs";
import * as path from "path";

export const buildBundle = async () => {
  const result = await Bun.build({
    entrypoints: ["./src/index.tsx"],
    outdir: "./build",
    loader: {
      ".css": "file",
    },
    plugins: [],
    // minify: MODE === "PROD",
    // minify: true,
    // sourcemap: "inline",`15
  });

  const cssFiles: string[] = [];

  result.outputs.forEach((output) => {
    console.log({ output });

    if (output.path.includes(".css")) {
      const cssFileHash = output.hash;

      const cssFile = `index-${cssFileHash}.css`;

      cssFiles.push(cssFile);
    }
  });

  console.log({ cssFiles });

  return {
    result,
    filePaths: {
      cssFiles,
    },
  };
};

export function serveFromDir({
  directory,
  reqPath,
}: {
  directory: string;
  reqPath: string;
}): Response | null {
  const basePath = path.join(directory, reqPath);
  const suffixes = ["", ".html", "index.html"];

  for (const suffix of suffixes) {
    try {
      const pathWithSuffix = path.join(basePath, suffix);
      const stat = statSync(pathWithSuffix);
      if (stat && stat.isFile()) {
        return new Response(Bun.file(pathWithSuffix));
      }
    } catch (err) {}
  }

  return null;
}

// const webSocketClients = new Set<ServerWebSocket>();

//  need to watch the directory for changes and notify the clients
// function watchSrcDirectory() {
//   const srcDir = path.join(PROJECT_ROOT, "src");
//   const watcher = fs.watch(
//     srcDir,
//     { recursive: true },
//     async (event, filename) => {
//       console.log(`File changed: ${filename}`);
//       await bundleBuilder();

//       // Notify all connected clients
//       for (const client of clients) {
//         client.send("refresh");
//       }
//     }
//   );

//   // Clean up the watcher when the server is closed
//   server.addEventListener("close", () => {
//     watcher.close();
//   });
// }