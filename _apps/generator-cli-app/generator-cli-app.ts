import path from "path";
import readline from "readline";
import { chooseActions, directoryExists } from "../../cli";
import {
  getFilesForDirectoryFromRoot,
  readFilesContents,
  saveResultToFile,
} from "../../files-folder";
import createOpenAICompletions from "../../networking";
import type { ActionsConfig } from "./repo-docs-generator";

const API_KEY = Bun.env.OPENAI_API_KEY || "";

// Define files to ignore
const ignoreFiles = ["index.ts", "tsconfig.json", "bun-types.d.ts"];
const fileOptions = { ignoreFiles };

// Get all TypeScript files in the current directory
const files = await getFilesForDirectoryFromRoot(".", fileOptions);
const tsFiles = files?.filter((file) => file.endsWith(".ts"));

// Read the contents of the TypeScript files
const allSourceFiles = readFilesContents(
  tsFiles?.filter((file) => !ignoreFiles.includes(file)) || []
);

// Initialize OpenAI completions
const openAICompletions = createOpenAICompletions({ apiKey: API_KEY });

// Store all response texts for consolidation
const allResponseText: Map<string, string[]> = new Map();

// Process a single action for a file
async function processAction(
  file: { path: string; content: string },
  promptAction: keyof ActionsConfig,
  actionsConfig: ActionsConfig,
  additionalPrompt: string
) {
  console.log(`Action: ${promptAction.toString()}`);
  const finalPromptArray = [
    file.content,
    actionsConfig[promptAction].prompt,
    additionalPrompt,
  ];

  const finalPrompt = finalPromptArray.join("\n");

  // Log the prompt that will be sent to the API
  console.log(`Prompt:\n${finalPrompt}\n`);

  const response = await openAICompletions.getCompletions({
    prompt: finalPrompt || "",
  });
  console.log(response);

  const messageContent = response.choices?.[0].message.content;

  // Log formatted output from the API response
  console.log(`Formatted output:\n${messageContent}\n`);

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

  return messageContent;
}

// Process all actions for a single file
async function processFile(
  file: { path: string; content: string },
  actionsConfig: ActionsConfig,
  promptActions: Array<keyof ActionsConfig>,
  additionalPrompt: string
) {
  console.log(`\nProcessing module: ${file.path}`);
  const consolidatedOutput = {};
  const promises = promptActions.map((promptAction) =>
    processAction(file, promptAction, actionsConfig, additionalPrompt).then(
      (output) => {
        consolidatedOutput[promptAction] = output;
      }
    )
  );
  await Promise.all(promises);
  return consolidatedOutput;
}

// Create consolidated files for each action and pass them to the API
async function createConsolidatedFiles(
  actionsConfig: ActionsConfig,
  finalUserPrompt: string
) {
  for (const [action, responseTexts] of allResponseText.entries()) {
    try {
      const consolidatedResponses = responseTexts.join("\n\n");
      const consolidatedOutputPath = path.join(
        "_docs",
        `${action}-consolidated.md`
      );

      // Save the consolidated responses first
      await saveResultToFile(consolidatedOutputPath, consolidatedResponses);

      console.log(
        `Consolidated file for '${action}' created at: ${consolidatedOutputPath}`
      );
      console.log("Consolidated file content:\n", consolidatedResponses);

      // Pass the consolidated result to the API along with the final user prompt
      const finalPrompt = `${consolidatedResponses}\n${finalUserPrompt}`;
      const finalResponse = await openAICompletions.getCompletions({
        prompt: finalPrompt || "",
      });

      const finalMessageContent = finalResponse.choices?.[0].message.content;

      // Save the final message content to the consolidated file
      await saveResultToFile(
        consolidatedOutputPath,
        `## Prompt\n${finalPrompt}\n\n## Response\n${finalMessageContent}`
      );

      console.log(
        `Updated consolidated file for '${action}' at: ${consolidatedOutputPath}`
      );
      console.log("Updated consolidated file content:\n", finalMessageContent);

      allResponseText.set(action, [finalMessageContent]);
    } catch (error) {
      console.error(`Error creating consolidated file for '${action}':`, error);
    }
  }

  // Prompt the user to either exit the program or pass the consolidated files to another prompt
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    "Do you want to exit the program or pass the consolidated files to another prompt? (exit/continue)",
    async (answer) => {
      if (answer === "exit") {
        console.log("Exiting the program...");
        process.exit(0);
      } else if (answer === "continue") {
        const newPrompt = await getUserInput(
          "Enter a new prompt to pass to the consolidated files: "
        );
        await createConsolidatedFiles(actionsConfig, newPrompt);
      } else {
        console.log("Invalid input. Exiting the program...");
        process.exit(0);
      }
    }
  );
}

function getUserInput(promptMessage: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(promptMessage, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

export async function getAdditionalPrompt(): Promise<string> {
  const response = await getUserInput(
    "Enter an additional prompt (leave empty for none): "
  );

  return response;
}

export async function getFinalUserPrompt(): Promise<string> {
  const response = await getUserInput(
    "Enter a final prompt to pass along with the consolidated result: "
  );

  return response;
}

// Main function to process all files and create consolidated output
export async function cliApp(actionsConfig: ActionsConfig): Promise<void> {
  try {
    const additionalPrompt = await getAdditionalPrompt();
    const promptActions = (await chooseActions(actionsConfig)) as Array<
      keyof ActionsConfig
    >;
    const fileProcessingPromises =
      allSourceFiles?.map((file) =>
        processFile(file, actionsConfig, promptActions, additionalPrompt)
      ) || [];
    const fileResults = await Promise.all(fileProcessingPromises);
    const finalUserPrompt = await getFinalUserPrompt();
    await createConsolidatedFiles(actionsConfig, finalUserPrompt);
  } catch (error) {
    console.error("Error in cliApp:", error);
  }
}
