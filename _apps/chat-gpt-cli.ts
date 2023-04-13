import { directoryExists, parseCliArgs } from "cli";
import { getFilesForDirectoryFromRoot, saveResultToFile } from "files-folder";
import fs from "fs";
import createOpenAICompletions, { CompletionsResponse } from "networking";
import path from "path";
import readline from "readline";

const API_KEY = Bun.env.OPENAI_API_KEY || "";

const promptMap = {
  clean:
    "clean up this code? Please use TypeScript syntax, do not class based syntax, make sure it it readable and performant",
  readme:
    "create a README.md file for this module? Please use markdown syntax and return the raw markdown string",
  comments:
    "add comments to this code? Please use TypeScript syntax, do not class based syntax, make sure it it readable and performant",
  explain: `explain this file? List other modules it depends on List the features of the module, and then give a brief technical description of the module. 
    "use markdown syntax and return the raw markdown string.`,
  examples: `Can you give examples of how to use this module? Please use markdown syntax and return the raw markdown string.`,
  summarize:
    "summarize the the most important features on this module? Include a list of all exports",
  // unitTest: `
  //   ${testFileContentDoc}
  //   The above is documentation for writing unit tests in Bun.
  //   Can you write unit tests for this module in bun? Please return only unit test code`,
  unitTest: `THis needs TLC`,
  improvements:
    "list improvements that can be made to this module? Please use markdown syntax and return the raw markdown string.",
};

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getAdditionalPrompt = () =>
  new Promise<string>((resolve) => {
    rl.question(
      "Do you want to add anything else to the above action prompt? (Press enter if not): ",
      (additionalPrompt) => {
        resolve(additionalPrompt);
      }
    );
  });

const chooseAction = async () => {
  return new Promise<string>((resolve) => {
    console.log("\nChoose an action:");
    const actions = Object.keys(promptMap);
    actions.forEach((action, index) => {
      console.log(`${index + 1}. ${action}`);
    });

    rl.question(
      "Enter the number corresponding to the action: ",
      (actionIndex) => {
        const selectedIndex = parseInt(actionIndex) - 1;
        if (selectedIndex >= 0 && selectedIndex < actions.length) {
          resolve(actions[selectedIndex]);
        } else {
          console.log("Invalid input, please try again.");
          resolve(chooseAction());
        }
      }
    );
  });
};

const promptAction = (await chooseAction()) as keyof typeof promptMap;
const additionalPrompt = await getAdditionalPrompt();

// close the readline interface after all input is taken
rl.close();

const randomFileIdx = Math.floor(Math.random() * allSourceFiles.length);

const finalPrompt = `
${additionalPrompt}

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

const allResponseText: string[] = [];

let overwriteAll = null;

for (const file of allSourceFiles) {
  const finalPrompt = `
${file.content}

${promptMap[promptAction]}

${additionalPrompt}
`;

  const result = (await openAICompletions.getCompletions({
    prompt: finalPrompt || "",
  })) as CompletionsResponse;

  const fileExtensionForAction = fileExtension[promptAction];
  const moduleName = path.dirname(file.path);
  const moduleNameWithoutExtension = path.basename(file.path, ".ts");
  const newFileName = `${promptAction}.${fileExtensionForAction}`;
  const newFilePath = path.join("_docs", moduleName, newFileName);

  const messageContent = result?.[0].message.content;

  const saveFilePath = `_docs/${moduleNameWithoutExtension}/${promptAction}.${fileExtensionForAction}`;

  console.log({
    fileExtensionForAction,
    moduleName,
    moduleNameWithoutExtension,
    newFileName,
    newFilePath,
    file,
  });

  directoryExists(path.dirname(newFilePath));

  if (fs.existsSync(newFilePath)) {
    if (overwriteAll === null) {
      const response = await new Promise<string>((resolve) => {
        process.stdin.resume();
        process.stdout.write(
          `Do you want to overwrite ${newFileName}? (yes/no/all) `
        );
        process.stdin.once("data", (data) => {
          resolve(data.toString().trim());
        });
      });

      if (response === "yes" || response === "all") {
        if (response === "all") {
          overwriteAll = true;
        }
        await saveResultToFile(saveFilePath, messageContent);
        allResponseText.push(file.path, messageContent);
      } else {
        console.error(
          `Failed to save result to ${newFilePath}: File already exists`
        );
      }
    } else if (overwriteAll) {
      await saveResultToFile(saveFilePath, messageContent);
      allResponseText.push(file.path, messageContent);
    }
  } else {
    allResponseText.push(file.path, messageContent);
    await saveResultToFile(saveFilePath, messageContent);
  }
}

const consolidatedResponses = allResponseText.join("\n\n");

const consolidatedOutputPath = path.join(
  "_docs",
  promptAction,
  "consolidated.md"
);
await saveResultToFile(consolidatedOutputPath, consolidatedResponses);
