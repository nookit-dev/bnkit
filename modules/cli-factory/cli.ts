import { BaseError } from "base-error";
import fs from "fs";
import path from "path";
import readline from "readline";
import {createErrorHandlerFactory} from "../error-handler-factory/create-error-handler-factory";
import {defaultLogger} from "../logger-factory";

// Get user input asynchronously
export async function getUserInput(): Promise<string> {
  const proc = Bun.spawÏn([]);
  return await new Response(proc.stdout).text();
}

// Interface for parsed command line arguments
export interface ParsedArgs {
  [key: string]: string | boolean;
}

interface OptionDefinition {
  default?: string | boolean;
  types: (string | boolean)[];
}

const optionDefinitions: { [key: string]: OptionDefinition } = {
  // Define available options here
};

// Parse command line arguments
export async function parseCliArgs(): Promise<ParsedArgs> {
  try {
    const args = process.argv.slice(2);
    const parsedArgs: ParsedArgs = {};

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg.startsWith("--")) {
        const key = arg.slice(2);
        if (optionDefinitions.hasOwnProperty(key)) {
          const optionDef = optionDefinitions[key];
          let value = optionDef.default;
          const nextArg = args[i + 1];
          if (nextArg && !nextArg.startsWith("--")) {
            const type = optionDef.types.find(
              (type) => typeof type === typeof value
            );
            if (type) value = type === "boolean" ? true : nextArg;
            i++;
          } else if (typeof value === "boolean") {
            value = true;
          }
          parsedArgs[key] = value;
        } else {
          parsedArgs[key] = true;
        }
      }
    }
    return parsedArgs;
  } catch (error) {
    throw handleError(error, true);
  }
}

// Ensure directory exists and create file with content
function createFileWithContent(filePath: string, content: string) {
  directoryExists(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
}

// Ensure directory exists
export function directoryExists(directoryPath: string) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
    console.log(`Created directory: ${directoryPath}`);
  }
}

// Get module names from path
export function getModulesFromPath(directoryPath: string) {
  return fs
    .readdirSync(directoryPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

export const getAdditionalPrompt = () =>
  new Promise<string>((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("Do you want to add anything else...", (additionalPrompt) => {
      rl.close();
      resolve(additionalPrompt);
    });
  });

export const chooseActions = async (
  actionsConfig: Record<string, any>
): Promise<Array<keyof typeof actionsConfig>> => {
  console.log("\nChoose actions (separated by commas):");
  const actions = Object.keys(actionsConfig);
  actions.forEach((action, index) => {
    console.log(`${index + 1}. ${action}`);
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const actionIndexes = await new Promise<string>((resolve) => {
    rl.question(
      "Enter the numbers corresponding to the actions: ",
      (actionIndexes) => {
        rl.close();
        resolve(actionIndexes);
      }
    );
  });

  const selectedIndexes = actionIndexes
    .split(",")
    .map((index) => parseInt(index.trim()) - 1);

  const validSelection = selectedIndexes.every(
    (index) => index >= 0 && index < actions.length
  );

  if (validSelection) {
    return selectedIndexes.map(
      (index) => actions[index] as keyof typeof actionsConfig
    );
  } else {
    console.log("Invalid input, please try again.");
    return chooseActions(actionsConfig);
  }
};

export type CLIOptions = {
  inputPrompt?: string;
  actionsConfig?: Record<string, any>;
  errorHandler?: ReturnType<typeof createErrorHandlerFactory>;
  logger?: typeof defaultLogger;
  fileConfig?: {
    filePath: string;
    fileContent: string;
  };
};

export function createCliFactory<DataType, E extends BaseError<DataType>>(
  options: CLIOptions
) {
  const errorHandler =
    options.errorHandler ??
    createErrorHandlerFactory<DataType, E>({ logger: options.logger });
  const actionsConfig = options.actionsConfig ?? {};
  const inputPrompt = options.inputPrompt ?? "Please input your command:";

  const processInput = async () => {
    try {
      const commandLineArgs = await errorHandler.handleAsync(() =>
        parseCliArgs()
      );
      const userInput = await errorHandler.handleAsync(() => getUserInput());
      // Handle user input and command line arguments...

      return { commandLineArgs, userInput };
    } catch (error) {
      errorHandler.handleSync(() => {
        throw error;
      });
    }
  };

  const executeActions = async () => {
    try {
      const additionalPrompt = await errorHandler.handleAsync(() =>
        getAdditionalPrompt()
      );
      const chosenActions = await errorHandler.handleAsync(() =>
        chooseActions(actionsConfig)
      );

      // Execute chosen actions...

      return { additionalPrompt, chosenActions };
    } catch (error) {
      errorHandler.handleSync(() => {
        throw error;
      });
    }
  };

  const handleFiles = () => {
    try {
      if (options.fileConfig) {
        const { filePath, fileContent } = options.fileConfig;
        errorHandler.handleSync(() => {
          directoryExists(filePath);
        });
        errorHandler.handleSync(() => {
          createFileWithContent(filePath, fileContent);
        });
      }
    } catch (error) {
      errorHandler.handleSync(() => {
        throw error;
      });
    }
  };

  return {
    inputPrompt,
    processInput,
    executeActions,
    handleFiles,
  };
}
