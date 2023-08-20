import fsPromise from "fs/promises";
import readline from "readline";
import { BaseError } from "utils/base-error";
import { createFileFactory } from "../..";
import { defaultLogger } from "../logger-factory";

const cliLog = (...args: any[]) => {
  console.info(...args);
};

// Get user input asynchronously
export async function getUserInput(): Promise<string> {
  const proc = Bun.spawn([]);
  return await new Response(proc.stdout).text();
}

// Interface for parsed command line arguments
export interface ParsedArgs {
  [key: string]: string | boolean | undefined;
}

export interface OptionDefinition {
  default?: string | boolean;
  types: (string | boolean)[];
}

const optionDefinitions: { [key: string]: OptionDefinition } = {
  // Define available options here
};

// Parse command line arguments
export function getArguments(): string[] {
  return process.argv.slice(2);
}

export function getOptionValue(
  arg: string,
  nextArg: string,
  optionDef: OptionDefinition
): string | boolean | undefined {
  let value = optionDef.default;

  if (nextArg && !nextArg.startsWith("--")) {
    const type = optionDef.types.find(
      (type) => type === typeof nextArg || type === typeof value
    );
    cliLog("Type found: ", type); // Debug log
    if (type === "boolean") {
      if (nextArg.toLowerCase() === "true") {
        value = true;
      } else if (nextArg.toLowerCase() === "false") {
        value = false;
      }
    } else {
      value = nextArg;
    }
  } else if (typeof value === "boolean") {
    value = true;
  }

  cliLog("Returned value: ", value); // Debug log
  return value;
}

export function parseArgument(
  arg: string,
  nextArg: string
): { key: string | undefined; value: string | boolean | undefined } {
  let key: string | undefined = undefined;
  let value: string | boolean | undefined;

  if (arg.startsWith("--")) {
    key = arg.slice(2);
    if (optionDefinitions.hasOwnProperty(key)) {
      const optionDef = optionDefinitions[key];
      value = getOptionValue(arg, nextArg, optionDef);
    } else {
      value = true;
    }
  } else {
    throw new Error(`Invalid parameter: ${arg}`);
  }

  return { key, value };
}

export async function parseCliArgs(): Promise<ParsedArgs> {
  try {
    const args = getArguments();
    const parsedArgs: ParsedArgs = {};

    for (let i = 0; i < args.length; i++) {
      const { key, value } = parseArgument(args[i], args[i + 1]);

      if (key) {
        parsedArgs[key] = value;
      }
    }

    return parsedArgs;
  } catch (error) {
    throw error;
  }
}

// Get module names from path
export const getModulesFromPath = async (directoryPath: string) => {
  const dirents = await fsPromise.readdir(directoryPath, {
    withFileTypes: true,
  });

  return dirents
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
};

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
  cliLog("\nChoose actions (separated by commas):");
  const actions = Object.keys(actionsConfig);
  actions.forEach((action, index) => {
    cliLog(`${index + 1}. ${action}`);
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
    cliLog("Invalid input, please try again.");
    return chooseActions(actionsConfig);
  }
};

export type CLIOptions = {
  inputPrompt?: string;
  actionsConfig?: Record<string, any>;
  logger?: typeof defaultLogger;
  // fileConfig?: {
  //   filePath: string;
  //   fileContent: string;
  // };
};

export function createCliFactory<DataType, E extends BaseError<DataType>>({
  inputPrompt = "Please input your command",
  actionsConfig = {},

  logger,
}: CLIOptions) {
  // const actionsConfig = options.actionsConfig ?? {};
  const fileFactory = createFileFactory({
    baseDirectory: ".", // Replace with actual path
  });

  const processInput = async () => {
    try {
      const commandLineArgs = await parseCliArgs();

      const userInput = await getUserInput();

      // Handle user input and command line arguments...
      return { commandLineArgs, userInput };
    } catch (error) {
      throw error;
    }
  };

  const executeActions = async () => {
    try {
      const additionalPrompt = await getAdditionalPrompt();

      const chosenActions = await chooseActions(actionsConfig);

      // Execute chosen actions...

      return { additionalPrompt, chosenActions };
    } catch (error) {
      throw error;
    }
  };

  const handleFiles = ({
    filePath,
    fileContent,
  }: {
    filePath: string;
    fileContent: string;
  }) => {
    try {
      // if (options.fileConfig) {
      // const { filePath, fileContent } = options.fileConfig;

      fileFactory.directoryExists(filePath);

      fileFactory.createFileWithContent(filePath, fileContent);
      // }
    } catch (error) {
      throw error;
    }
  };

  return {
    inputPrompt,
    processInput,
    executeActions,
    handleFiles,
  };
}
