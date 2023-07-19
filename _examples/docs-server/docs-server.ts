import { serve } from "bun";
import {
  getFilesForDirectoryFromRoot,
  readFilesContents,
} from "files-factory/files-folder";
import { convertMarkdownToHTML } from "utils/text-utils";

const docsDirectory = "_docs";

const files = readFilesContents(getFilesForDirectoryFromRoot(docsDirectory));

const fileTree = files.reduce((tree, file) => {
  const filePath = file.path.replace(".md", "");
  const parts = filePath.split("/");
  const fileName = parts.pop()!;
  let currentNode = tree;
  for (const part of parts) {
    if (!currentNode[part]) {
      currentNode[part] = {};
    }
    currentNode = currentNode[part];
  }
  currentNode[fileName] = file.content;
  return tree;
}, {});

const generateLinks = (node: any, path: string): string => {
  let links = "";
  for (const key in node) {
    const newPath = path + "/" + key;
    if (typeof node[key] === "string") {
      links += `<li><a href="${newPath}">${key}</a></li>`;
    } else {
      links += `<li>${key}<ul>${generateLinks(node[key], newPath)}</ul></li>`;
    }
  }
  return links;
};

const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Docs</title>
  </head>
  <body>
    <ul>${generateLinks(fileTree, "")}</ul>
  </body>
</html>
`;

serve({
  fetch(req) {
    const url = new URL(req.url);
    const filePath = url.pathname.slice(1); // remove leading slash
    if (filePath in fileTree) {
      const content = fileTree[filePath];
      const html = convertMarkdownToHTML(content);
      return new Response(html, { headers: { "Content-Type": "text/html" } });
    } else {
      return new Response("Not found", { status: 404 });
    }
  },
  routes: [
    {
      path: "",
      fetch: () =>
        new Response(html, { headers: { "Content-Type": "text/html" } }),
    },
  ],
});
