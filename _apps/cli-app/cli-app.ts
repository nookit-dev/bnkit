import path from "path";
import { chooseActions, directoryExists, getAdditionalPrompt } from "../../cli";
import {
  getFilesForDirectoryFromRoot,
  readFilesContents,
  saveResultToFile,
} from "../../files-folder";
import createOpenAICompletions, { CompletionsResponse } from "../../networking";
import {
  ActionsConfig,
  chatGptActionsConfig,
} from "./repo-docs-generator-config";

const API_KEY = Bun.env.OPENAI_API_KEY || "";

// Define files to ignore
const ignoreFiles = ["index.ts", "tsconfig.json", "bun-types.d.ts"];
const fileOptions = { ignoreFiles };

// Get all TypeScript files in the current directory
const files = await getFilesForDirectoryFromRoot(".", fileOptions);
const tsFiles = files.filter((file) => file.endsWith(".ts"));

// Read the contents of the TypeScript files
const allSourceFiles = readFilesContents(
  tsFiles.filter((file) => !ignoreFiles.includes(file))
);

// Initialize OpenAI completions
const openAICompletions = createOpenAICompletions({ apiKey: API_KEY });

// Get user input for actions and additional prompts
const promptActions = (await chooseActions(chatGptActionsConfig)) as Array<
  keyof typeof chatGptActionsConfig
>;
const additionalPrompt = await getAdditionalPrompt();

// Store all response texts for consolidation
const allResponseText: Map<string, string[]> = new Map();

// Process a single action for a file
async function processAction(
  file: { path: string; content: string },
  promptAction: keyof typeof chatGptActionsConfig,
  actionsConfig: ActionsConfig
) {
  console.log(`Action: ${promptAction.toString()}`);
  const finalPromptArray = [
    file.content,
    actionsConfig[promptAction].prompt,
    additionalPrompt,
  ];

  const finalPrompt = finalPromptArray.join("\n");

  const result = await openAICompletions.getCompletions({
    prompt: finalPrompt || "",
  });
  const response = result as CompletionsResponse;
  const messageContent = response?.[0].message.content;
  const fileExtensionForAction = actionsConfig[promptAction].fileExtension;
  const outputFolderForAction =
    actionsConfig[promptAction].outputFolder || "_docs";

  const moduleNameWithoutExtension = path.basename(file.path, ".ts");
  const saveFilePath = `${outputFolderForAction}/${moduleNameWithoutExtension}/${promptAction}.${fileExtensionForAction}`;

  directoryExists(path.dirname(saveFilePath));
  console.log(`Saving to: ${saveFilePath} \n`);

  await saveResultToFile(saveFilePath, messageContent);

  if (!allResponseText.has(promptAction)) {
    allResponseText.set(promptAction, []);
  }
  allResponseText.get(promptAction)?.push(saveFilePath, messageContent);
}

// Process all actions for a single file
async function processFile(
  file: { path: string; content: string },
  actionsConfig: ActionsConfig
) {
  console.log(`\nProcessing module: ${file.path}`);
  const promises = promptActions.map((promptAction) =>
    processAction(file, promptAction, actionsConfig)
  );
  await Promise.all(promises);
}

// Create consolidated files for each action
async function createConsolidatedFiles() {
  for (const [action, responseTexts] of allResponseText.entries()) {
    const consolidatedResponses = responseTexts.join("\n\n");
    const consolidatedOutputPath = path.join(
      "_docs",
      `${action}-consolidated.md`
    );
    await saveResultToFile(consolidatedOutputPath, consolidatedResponses);
  }
}

// Main function to process all files and create consolidated output
export async function cliApp(actionsConfig: ActionsConfig) {
  const fileProcessingPromises = allSourceFiles.map((file) =>
    processFile(file, actionsConfig)
  );
  await Promise.all(fileProcessingPromises);
  await createConsolidatedFiles();
}
