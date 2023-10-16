import * as fs from "fs";
import * as path from "path";

type BuilderPaths = {
  scriptPaths: string[];
  stylePaths: string[];
};

type PageBuilderConfig = {
  buildDir: string;
  paths: BuilderPaths;
};

export const createPageBuilder = ({ buildDir, paths }: PageBuilderConfig) => {
  const createScriptLink = (src: string) =>
    `<script src="${src}" async type="module"></script>`;
  const createStyleLink = (href: string) =>
    `<link rel="stylesheet" href="${href}" />`;

  const createScriptsFromPaths = (paths: string[]) => {
    return paths.map(createScriptLink).join("\n");
  };

  const createStyleLinksFromPaths = (paths: string[]) => {
    return paths.map(createStyleLink).join("\n");
  };

  const createBaseFileHTMLString = async (
    {
      scriptsStringifed = createScriptsFromPaths(paths.scriptPaths),
      stylesStringified = createStyleLinksFromPaths(paths.stylePaths),
    }: {
      scriptsStringifed: string;
      stylesStringified: string;
    } = {
      scriptsStringifed: createScriptsFromPaths(paths.scriptPaths),
      stylesStringified: createStyleLinksFromPaths(paths.stylePaths),
    }
  ) => {
    return `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="utf-8" />
              <link rel="icon" href="favicon.ico" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <meta name="theme-color" content="#000000" />
              <meta name="description" content="Web site created using create-react-app" />
              <link rel="apple-touch-icon" href="/logo192.png" />
              
              <link rel="manifest" href="/manifest.json" />
              
              <title>React App</title>
              
              ${stylesStringified}
            </head>
            <body>
              <noscript>You need to enable JavaScript to run this app.</noscript>
              <div id="root"></div>
              
              ${scriptsStringifed} 
            </body>
          </html>
          
          `;
  };

  const generateHtmlFile = async (
    {
      directory = buildDir,
      filename = "index.html",
    }: {
      directory?: string;
      filename?: string;
    } = {
      directory: buildDir,
      filename: "index.html",
    }
  ) => {
    const html = await createBaseFileHTMLString({
      scriptsStringifed: createScriptsFromPaths(paths.scriptPaths),
      stylesStringified: createStyleLinksFromPaths(paths.stylePaths),
    });
    const htmlPath = path.join(directory, filename);

    try {
      await fs.promises.writeFile(htmlPath, html);

      return {
        status: "success",
        result: html,
        htmlPath: htmlPath,
      };
    } catch (err) {
      console.log("Error writing html file", err);
      return {
        status: "error",
        result: "",
        htmlPath: "",
      };
    }
  };

  return {
    generateHtmlFile,
    createScriptLink,
    createStyleLink,
    createScriptsFromPaths,
    createStyleLinksFromPaths,
    writeHTMLBaseFile: createBaseFileHTMLString,
  };
};
