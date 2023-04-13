import { directoryExists } from "cli";
import { getFilesForDirectoryFromRoot, saveResultToFile } from "files-folder";
import fs from "fs";
import createOpenAICompletions, { CompletionsResponse } from "networking";
import path from "path";
import readline from "readline";

const API_KEY = Bun.env.OPENAI_API_KEY || "";

const promptConfig = {
  clean: {
    prompt:
      "clean up this code? Please use TypeScript syntax, do not class based syntax, make sure it it readable and performant",
    fileExtension: "md",
  },
  readme: {
    prompt:
      "create a README.md file for this module? Please use markdown syntax and return the raw markdown string",
    fileExtension: "md",
  },
  comments: {
    prompt:
      "add comments to this code? Please use TypeScript syntax, do not class based syntax, make sure it it readable and performant",
    fileExtension: "md",
  },
  explain: {
    prompt: `explain this file? List other modules it depends on List the features of the module, and then give a brief technical description of the module. 
    "use markdown syntax and return the raw markdown string.`,
    fileExtension: "md",
  },
  examples: {
    prompt: `Can you give examples of how to use this module? Please use markdown syntax and return the raw markdown string.`,
    fileExtension: "md",
  },
  summarize: {
    prompt:
      "summarize the the most important features on this module? Include a list of all exports, return as raw markdown",
    fileExtension: "md",
  },
  unitTest: {
    prompt: `This needs TLC`,
    fileExtension: "ts",
  },
  improvements: {
    prompt:
      "list improvements that can be made to this module? Please use markdown syntax and return the raw markdown string.",
    fileExtension: "md",
  },
};

const ignoreFiles = ["index.ts", "tsconfig.json", "bun-types.d.ts"];
const fileOptions = { ignoreFiles };

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
    const actions = Object.keys(promptConfig);
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

const promptAction = (await chooseAction()) as keyof typeof promptConfig;
const additionalPrompt = await getAdditionalPrompt();

// close the readline interface after all input is taken
rl.close();

const allResponseText: string[] = [];

for (const file of allSourceFiles) {
  console.log(`\nProcessing module: ${file.path}`);
  console.log(`Action: ${promptAction}`);

  const finalPrompt = `
${file.content}

${promptConfig[promptAction].prompt}

${additionalPrompt}
`;

  const result = (await openAICompletions.getCompletions({
    prompt: finalPrompt || "",
  })) as CompletionsResponse;

  const fileExtensionForAction = promptConfig[promptAction].fileExtension;
  const moduleName = path.dirname(file.path);
  const moduleNameWithoutExtension = path.basename(file.path, ".ts");
  const newFileName = `${promptAction}.${fileExtensionForAction}`;
  const newFilePath = path.join("_docs", moduleName, newFileName);

  const messageContent = result?.[0].message.content;

  const saveFilePath = `_docs/${moduleNameWithoutExtension}/${promptAction}.${fileExtensionForAction}`;

  directoryExists(path.dirname(newFilePath));

  console.log(`Saving to: ${newFilePath} \n`);
  // Always overwrite
  await saveResultToFile(saveFilePath, messageContent);
  allResponseText.push(newFilePath, messageContent);
}

const consolidatedResponses = allResponseText.join("\n\n");

const consolidatedOutputPath = path.join(
  "_docs",
  `${promptAction}-consolidated.md`
);

await saveResultToFile(consolidatedOutputPath, consolidatedResponses);

// How to automate unit tests,
// if there is already unit tests for the file, run the unit tests  and just see whether they're passing or failing
// generate unit tests based on a modules source code
// save unit test to a file with random name(maybe use the modules name plus a random number)
// spawn a new process to run the unit tests
// if all pass then move into the _tests folder with that modules name for example _tests/module-name.test.ts, try this 3 times
// if after 3 times they fail
