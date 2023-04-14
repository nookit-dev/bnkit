import { directoryExists } from "cli";
import {
  getFilesForDirectoryFromRoot,
  readFilesContents,
  saveResultToFile,
} from "files-folder";
import createOpenAICompletions, { CompletionsResponse } from "networking";
import path from "path";
import readline from "readline";

const API_KEY = Bun.env.OPENAI_API_KEY || "";

const actionsConfig = {
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
    prompt: `Based on the above module, write unit tests for it. Please use TypeScript syntax and return the raw string.`,
    fileExtension: "test.ts",
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

const allSourceFiles = readFilesContents(
  tsFiles.filter((file) => !ignoreFiles.includes(file))
);

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

const chooseActions = async () => {
  return new Promise<string[]>((resolve) => {
    console.log("\nChoose actions (separated by commas):");
    const actions = Object.keys(actionsConfig);
    actions.forEach((action, index) => {
      console.log(`${index + 1}. ${action}`);
    });

    rl.question(
      "Enter the numbers corresponding to the actions: ",
      (actionIndexes) => {
        const selectedIndexes = actionIndexes
          .split(",")
          .map((index) => parseInt(index.trim()) - 1);

        const validSelection = selectedIndexes.every(
          (index) => index >= 0 && index < actions.length
        );

        if (validSelection) {
          resolve(selectedIndexes.map((index) => actions[index]));
        } else {
          console.log("Invalid input, please try again.");
          resolve(chooseActions());
        }
      }
    );
  });
};

const promptActions = (await chooseActions()) as Array<
  keyof typeof actionsConfig
>;
const additionalPrompt = await getAdditionalPrompt();

// close the readline interface after all input is taken
rl.close();

const allResponseText: Map<string, string[]> = new Map();

for (const file of allSourceFiles) {
  console.log(`\nProcessing module: ${file.path}`);
  const promises = [];

  for (const promptAction of promptActions) {
    console.log(`Action: ${promptAction}`);

    const finalPrompt = `
  ${file.content}
  
  ${actionsConfig[promptAction].prompt}
  
  ${additionalPrompt}
  `;

    const resultPromise = openAICompletions
      .getCompletions({
        prompt: finalPrompt || "",
      })
      .then((result) => {
        const response = result as CompletionsResponse;
        const fileExtensionForAction =
          actionsConfig[promptAction].fileExtension;
        const messageContent = response?.[0].message.content;

        const moduleNameWithoutExtension = path.basename(file.path, ".ts");
        const saveFilePath = `_docs/${moduleNameWithoutExtension}/${promptAction}.${fileExtensionForAction}`;

        directoryExists(path.dirname(saveFilePath));

        console.log(`Saving to: ${saveFilePath} \n`);
        // Always overwrite
        return saveResultToFile(saveFilePath, messageContent).then(() => {
          if (!allResponseText.has(promptAction)) {
            allResponseText.set(promptAction, []);
          }
          allResponseText.get(promptAction)?.push(saveFilePath, messageContent);
        });
      });

    promises.push(resultPromise);
  }

  // Wait for all actions to complete for the current file
  await Promise.all(promises);
}

for (const [action, responseTexts] of allResponseText.entries()) {
  const consolidatedResponses = responseTexts.join("\n\n");

  const consolidatedOutputPath = path.join(
    "_docs",
    `${action}-consolidated.md`
  );

  await saveResultToFile(consolidatedOutputPath, consolidatedResponses);
}
