import { BaseError } from "base-error";
import fs from "fs";
import path from "path";
import { createErrorHandlerFactory } from "../..";
import { handleError } from "../error-handler-validation";

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
): Promise<void | undefined> => {
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

type FileFactoryOptions = {
  baseDirectory: string;
  errorHandler: ReturnType<
    typeof createErrorHandlerFactory<any, BaseError<any>>
  >;
};

export function createFileFactory({
  baseDirectory,
  errorHandler,
}: FileFactoryOptions) {
  const getFullPath = (filePath: string) => path.join(baseDirectory, filePath);

  const updateFiles = async (filePaths: string[], data: string) => {
    const promises = filePaths.map(async (filePath) => {
      const fullPath = getFullPath(filePath);
      await fs.promises.writeFile(fullPath, data);
    });
    await errorHandler.handleAsync(() => Promise.all(promises));
  };

  const readFilesRawText = async (filePaths: string[]) => {
    const promises = filePaths.map(async (filePath) => {
      const fullPath = getFullPath(filePath);
      const data = await fs.promises.readFile(fullPath, "utf-8");
      return data;
    });
    return await errorHandler.handleAsync(() => Promise.all(promises));
  };

  const searchDirectory = async (fileName: string) => {
    return await errorHandler.handleAsync(async () => {
      const files = await fs.promises.readdir(baseDirectory);
      return files.includes(fileName);
    });
  };

  const fileExists = async (filePath: string) => {
    const fullPath = getFullPath(filePath);
    return await errorHandler.handleAsync(async () => {
      const exists = await fs.promises.access(fullPath, fs.constants.F_OK);
      return exists;
    });
  };

  const deleteFile = async (filePath: string) => {
    const fullPath = getFullPath(filePath);
    return await errorHandler.handleAsync(async () => {
      await fs.promises.unlink(fullPath);
    });
  };

  const readJson = async (filePath: string) => {
    const rawText = await readFilesRawText([filePath]);
    return JSON.parse(rawText[0]);
  };

  const writeJson = async (filePath: string, data: any) => {
    await updateFiles([filePath], JSON.stringify(data, null, 2));
  };

  return {
    updateFiles,
    readFilesRawText,
    searchDirectory,
    fileExists,
    deleteFile,
    readJson,
    writeJson,
  };
}
