console.log("Args: ", process.argv);
import { parseCliArgs } from "cli";
import { getFilesForDirectoryFromRoot } from "files-folder";
import fs from "fs";
import path from "path";
import createOpenAICompletions, {
  CompletionsResponse,
} from "../openai-completions";

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

const sourceFilesArray = allSourceFiles.map((file) => {
  const fileContent = file.content;
  return fileContent;
});

const openAICompletions = createOpenAICompletions({ apiKey: API_KEY });

const userPrompt = args.prompt.toString();

const promptMap = {
  clean:
    "Can you clean up this code? Please use TypeScript syntax, do not class based syntax, make sure it it readable and performant",
  readme:
    "Can you create a README.md file for this module? Please use markdown syntax and return the raw markdown string",
  comments:
    "Can you add comments to this code? Please use TypeScript syntax, do not class based syntax, make sure it it readable and performant",
  explain: `Can you explain this file? List other modules it depends on List the features of the module, and then give a brief technical description of the module. 
    Please use markdown syntax and return the raw markdown string.`,
  examples: `Can you give examples of how to use this module? Please use markdown syntax and return the raw markdown string.`,
  summarize:
    "Can you summarize the the most important features on this module?",
  unitTest:
    "Can you write unit tests for this module? Please use the following files as examples of how to write unit tests in this repo",
  improvements:
    "Can you list improvements that can be made to this module? Please use markdown syntax and return the raw markdown string.",
};

const promptAction = args?.action?.toString() as keyof typeof promptMap;

const randomFileIdx = Math.floor(Math.random() * allSourceFiles.length);
// const randomFile = allSourceFiles[randomFileIdx];

const finalPrompt = `
${userPrompt}

${sourceFilesArray[randomFileIdx]}

${promptMap[promptAction]}
`;

const result = await openAICompletions.getCompletions({
  prompt: finalPrompt || "",
});

// write content to file suffixed with -${actionFlag}

const fileExtension = {
  readme: "md",
  comments: "md",
  explain: "md",
  examples: "md",
  summarize: "md",
  unitTest: "ts",
  improvements: "md",
};

const folders = {
  readme: "_docs",
  comments: "_docs",
  explain: "_docs",
  examples: "_docs",
  summarize: "_docs",
  unitTest: "_tests",
  improvements: "_improvements",
};

const saveResultToFile = async (filePath: string, content: string) => {
  try {
    await fs.promises.writeFile(filePath, content, "utf8");
    console.log(`Successfully saved result to ${filePath}`);
  } catch (err) {
    console.error(`Failed to save result to ${filePath}:`, err);
  }
};

for (const file of allSourceFiles) {
  const finalPrompt = `
${userPrompt}

${file.content}

${promptMap[promptAction]}
`;

  const result = (await openAICompletions.getCompletions({
    prompt: finalPrompt || "",
    // TODO not sure why the type is not working here
  })) as CompletionsResponse;

  const fileExtensionForAction = fileExtension[promptAction];

  console.log({
    promptAction,
    fileExtensionForAction,
  });

  const fileNameWithoutExtension = path.basename(file.path, ".ts");
  const newFileName = `${fileNameWithoutExtension}-${promptAction}.${fileExtensionForAction}`;
  const newFilePath = path.join(folders[promptAction], newFileName);

  console.log({
    fileNameWithoutExtension,
    newFileName,
    newFilePath,
  });

  console.log({
    path: newFilePath,
    content: result?.[0].message,
  });

  await saveResultToFile(newFilePath, result?.[0].message.content);
}
