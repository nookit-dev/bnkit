import { parseCliArgs } from "cli";
import { getFilesForDirectoryFromRoot } from "files-folder";
import fs from "fs";
import path from "path";
import createOpenAICompletions from "../openai-completions";

const API_KEY = Bun.env.OPENAI_API_KEY || "";

const args = await parseCliArgs();

const ignoreFiles = ["index.ts", "tsconfig.json", "bun-types.d.ts"];

const fileOptions = {
  ignoreFiles: ignoreFiles,
};

const files = await getFilesForDirectoryFromRoot(".", fileOptions);

const tsFiles = files.filter((file) => file.endsWith(".ts"));

const readFilesContents = (filePaths: string[]) => {
  const fileContentsFull: { path: string; content: string }[] = [];

  filePaths.forEach((filePath) => {
    const filename = path.basename(filePath);

    try {
      fileContentsFull.push({
        path: filename,
        content: fs.readFileSync(filePath, "utf8"),
      });
    } catch (err) {
      console.error(err);
    }
  });

  return fileContentsFull;
};

const allSourceFiles = readFilesContents(
  tsFiles.filter((file) => !ignoreFiles.includes(file))
);

const splitIntoChunks = (str: string, chunkSize: number) => {
  const chunks = [];
  let i = 0;
  const n = str.length;
  while (i < n) {
    chunks.push(str.slice(i, (i += chunkSize)));
  }
  return chunks;
};

const fileToPass = allSourceFiles.map((file) => {
  const fileContent = file.content;
  return fileContent;
});

const openAICompletions = createOpenAICompletions({ apiKey: API_KEY });

const userPrompt = args.prompt.toString();

type PromptActionType = "clean" | "createReadme" | "addComments";

const promptAction = args?.action?.toString();

console.log(args)

const promptMap: Record<PromptActionType, string> = {
  clean:
    "Can you clean up this code? Please use TypeScript syntax, do not class based syntax, make sure it it readable and performant",
  createReadme:
    "Can you create a README.md file for this module? Please use markdown syntax and return the raw markdown string",
  addComments:
    "Can you add comments to this code? Please use TypeScript syntax, do not class based syntax, make sure it it readable and performant",
};


const randomFile = Math.floor(Math.random() * allSourceFiles.length);

console.log(fileToPass[5])

const finalPrompt = `
${userPrompt}

${fileToPass[randomFile]}

${promptMap[promptAction]}
`;

const result = await openAICompletions.getCompletions({
  prompt: finalPrompt,
});

console.log(result);
// write content to file suffixed with -${actionFlag}

await fs.writeFile(`${randomFile.path}`, result, { encoding: "utf-8" });
