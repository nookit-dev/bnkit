import path from "path";
import readline from "readline";
import { directoryExists } from "../../cli";
import {
  getFilesForDirectoryFromRoot,
  readFilesContents,
  saveResultToFile,
} from "../../files-folder";
import createOpenAICompletions, { CompletionsResponse } from "../../networking";
import { ActionsConfig, chatGptActionsConfig } from "./actions-config";

const API_KEY = Bun.env.OPENAI_API_KEY || "";

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
    rl.question("Do you want to add anything else...", (additionalPrompt) => {
      resolve(additionalPrompt);
    });
  });

const chooseActions = async (
  actionsConfig: ActionsConfig
): Promise<Array<keyof typeof actionsConfig>> => {
  return new Promise<Array<keyof typeof actionsConfig>>((resolve) => {
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
          resolve(
            selectedIndexes.map(
              (index) => actions[index] as keyof typeof actionsConfig
            )
          );
        } else {
          console.log("Invalid input, please try again.");
          resolve(chooseActions(actionsConfig));
        }
      }
    );
  });
};

const promptActions = (await chooseActions(chatGptActionsConfig)) as Array<
  keyof typeof chatGptActionsConfig
>;
const additionalPrompt = await getAdditionalPrompt();
rl.close();

const allResponseText: Map<string, string[]> = new Map();

async function main(actionsConfig: ActionsConfig) {
  for (const file of allSourceFiles) {
    console.log(`\nProcessing module: ${file.path}`);
    const promises = [];

    for (const promptAction of promptActions) {
      console.log(`Action: ${promptAction.toString()}`);
      const finalPromptArray = [
        file.content,
        actionsConfig[promptAction].prompt,
        additionalPrompt,
      ];

      const finalPrompt = finalPromptArray.join("\n");

      const resultPromise = openAICompletions
        .getCompletions({ prompt: finalPrompt || "" })
        .then((result) => {
          const response = result as CompletionsResponse;
          const fileExtensionForAction =
            actionsConfig[promptAction].fileExtension;
          const messageContent = response?.[0].message.content;

          const moduleNameWithoutExtension = path.basename(file.path, ".ts");
          const saveFilePath = `_docs/${moduleNameWithoutExtension}/${promptAction}.${fileExtensionForAction}`;

          directoryExists(path.dirname(saveFilePath));
          console.log(`Saving to: ${saveFilePath} \n`);

          return saveResultToFile(saveFilePath, messageContent).then(() => {
            if (!allResponseText.has(promptAction)) {
              allResponseText.set(promptAction, []);
            }
            allResponseText
              .get(promptAction)
              ?.push(saveFilePath, messageContent);
          });
        });

      promises.push(resultPromise);
    }

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
}

await main(chatGptActionsConfig);
