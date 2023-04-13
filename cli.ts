import { handleError } from "error-handler-validation";
import fs from "fs";
import path from "path";

// Get user input asynchronously
export async function getUserInput(): Promise<string> {
  const proc = Bun.spawn([]);
  return await new Response(proc.stdout).text();
}

// Interface for parsed command line arguments
interface ParsedArgs {
  [key: string]: string | boolean;
}

// Parse command line arguments
export async function parseCliArgs(): Promise<ParsedArgs> {
  try {
    const args = process.argv.slice(2);
    const parsedArgs: ParsedArgs = {};

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg.startsWith("--")) {
        const key = arg.slice(2);
        const nextArg = args[i + 1];
        parsedArgs[key] = nextArg && !nextArg.startsWith("--") ? nextArg : true;
        if (nextArg) i++;
      }
    }
    return parsedArgs;
  } catch (error) {
    throw handleError(error, true);
  }
}

// Ensure directory exists and create file with content
function createFileWithContent(filePath: string, content: string) {
  ensureDirectoryExists(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
}

// Ensure directory exists
function ensureDirectoryExists(directoryPath: string) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

// Get module names from path
export function getModulesFromPath(directoryPath: string) {
  return fs
    .readdirSync(directoryPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}
