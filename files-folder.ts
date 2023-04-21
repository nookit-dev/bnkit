import fs from "fs";
import path from "path";
import { handleError } from "./error-handler-validation";

export const getFilesForDirectory = (
  directory: "_apps" | "_tests" | "_docs" | "." | "../" | ".../" | string,
  { ignoreFiles: ignoreFiles = [] }: { ignoreFiles?: string[] } = {}
): string[] | undefined => {
  try {
    const appFiles = fs
      .readdirSync(directory)
      .map((filename) => path.join(directory, filename))
      .map((filename) => path.parse(filename).name);

    return appFiles.filter((filename) => !ignoreFiles.includes(filename));
  } catch (error) {
    handleError(error as Error);
  }
};

export const getFilesForDirectoryFromRoot = (
  directory: "_apps" | "_tests" | "_docs" | "." | "../" | ".../" | string,
  { ignoreFiles: ignoreFiles = [] }: { ignoreFiles?: string[] } = {}
): string[] | undefined => {
  try {
    const rootPath = findAppRoot(process.cwd()) || ".";
    const targetDirectory = path.join(rootPath, directory);

    console.log(rootPath, targetDirectory);
    return getFilesForDirectory(targetDirectory, { ignoreFiles });
  } catch (error) {
    handleError(error as Error);
  }
};

export function isRootFolder(folderPath: string): boolean | undefined {
  try {
    return fs.existsSync(path.join(folderPath, "tsconfig.json"));
  } catch (error) {
    handleError(error as Error);
  }
}

export function findAppRoot(startingPath: string): string | null | undefined {
  try {
    let currentPath = startingPath;

    while (!isRootFolder(currentPath)) {
      const parentPath = path.dirname(currentPath);

      if (parentPath === currentPath) {
        return null;
      }

      currentPath = parentPath;
    }

    return currentPath;
  } catch (error) {
    handleError(error as Error);
  }
}

export const saveResultToFile = async (
  filePath: string,
  content: string
): Promise<void> | undefined => {
  try {
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.writeFile(filePath, content);
  } catch (err) {
    handleError(err as Error);
  }
};

export const readFilesContents = (
  filePaths: string[]
): { path: string; content: string }[] | undefined => {
  try {
    return filePaths.map((filePath) => {
      const filename = path.basename(filePath);
      const content = fs.readFileSync(filePath, "utf8");
      return { path: filename, content };
    });
  } catch (error) {
    handleError(error as Error);
  }
};
