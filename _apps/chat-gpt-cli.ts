import { parseCliArgs } from "cli";
import { getFilesForDirectoryFromRoot, saveResultToFile } from "files-folder";
import fs from "fs";
import path from "path";
import createOpenAICompletions, { CompletionsResponse } from "../networking";
const API_KEY = Bun.env.OPENAI_API_KEY || "";

const ignoreFiles = ["index.ts", "tsconfig.json", "bun-types.d.ts"];
const fileOptions = { ignoreFiles };

const args = await parseCliArgs();
const files = await getFilesForDirectoryFromRoot(".", fileOptions);
const tsFiles = files.filter((file) => file.endsWith(".ts"));

const readFilesContents = (filePaths: string[]) => {
  return filePaths.map((filePath) => {
    const filename = path.basename(filePath);
    const content = fs.readFileSync(filePath, "utf8");
    return { path: filename, content };
  });
};

const allSourceFiles = readFilesContents(
  tsFiles.filter((file) => !ignoreFiles.includes(file))
);

const sourceFilesArray = allSourceFiles.map((file) => {
  const fileContent = file.content;
  return fileContent;
});

const openAICompletions = createOpenAICompletions({ apiKey: API_KEY });

const userPrompt = args.prompt.toString();

let testFileContentDoc = "";

const promptAction = args?.action?.toString() as keyof typeof promptMap;
if (promptAction === "unitTest") {
  // load ./test.md
  testFileContentDoc = fs.readFileSync("./_apps/test.md", "utf8");
}

console.log({ testFileContentDoc });

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
    "Can you summarize the the most important features on this module? Include a list of all exports",
  unitTest: `
    ${testFileContentDoc}
    The above is documentation for writing unit tests in Bun.
    Can you write unit tests for this module in bun? Please return only unit test code`,
  improvements:
    "Can you list improvements that can be made to this module? Please use markdown syntax and return the raw markdown string.",
};

console.log({
  promptMap,
});

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

const allResponseText: string[] = [];

for (const file of allSourceFiles) {
  const finalPrompt = `
${userPrompt}

${file.content}

${promptMap[promptAction]}
`;

  const result = (await openAICompletions.getCompletions({
    prompt: finalPrompt || "",
  })) as CompletionsResponse;

  const fileExtensionForAction = fileExtension[promptAction];
  const fileNameWithoutExtension = path.basename(file.path, ".ts");
  const newFileName = `${fileNameWithoutExtension}-${promptAction}.${fileExtensionForAction}`;
  const newFilePath = path.join(folders[promptAction], newFileName);

  const messageContent = result?.[0].message.content;

  if (!fs.existsSync(newFilePath)) {
    allResponseText.push(file.path, messageContent);
    await saveResultToFile(newFilePath, messageContent);
  } else {
    console.error(
      `Failed to save result to ${newFilePath}: File already exists`
    );
  }

  await saveResultToFile(newFilePath, messageContent);
}

const consolidatedResponses = allResponseText.join("\n\n");

await saveResultToFile(
  path.join("_docs", `all-${promptAction}.md`),
  consolidatedResponses
);
