import { handleError } from "error-handler";

export async function getUserInput({}: {}): Promise<string> {
  // use async await to get user input
  const proc = Bun.spawn([]);

  const text = await new Response(proc.stdout).text();
  return text;
}

interface ParsedArgs {
  [key: string]: string | boolean;
}

export async function parseCliArgs(): Promise<ParsedArgs> {
  try {
    const args = process.argv.slice(2);
    const parsedArgs: ParsedArgs = {};

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      if (arg.startsWith("--")) {
        const key = arg.slice(2);
        const nextArg = args[i + 1];

        if (nextArg && !nextArg.startsWith("--")) {
          parsedArgs[key] = nextArg;
          i++;
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
