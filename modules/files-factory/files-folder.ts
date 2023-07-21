import fs from "fs";
import path from "path";
import { BaseError } from "utils/base-error";
import { handleError } from "validation-factory/validation-factory";
import { createErrorHandlerFactory } from "../..";

/**
 * The `saveResultToFile` function saves the given content to a file at the specified file path.
 * @param {string} filePath - A string representing the file path where the result will be saved.
 * @param {string} content - The `content` parameter is a string that represents the content that you
 * want to save to a file.
 */
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

/**
 * The function `readFilesContents` reads the contents of multiple files specified by their file paths
 * and returns an array of objects containing the file path and its content.
 * @param {string[]} filePaths - An array of strings representing the paths of the files you want to
 * read.
 * @returns The function `readFilesContents` returns an array of objects, where each object has two
 * properties: `path` and `content`. The `path` property is a string representing the filename
 * extracted from the file path, and the `content` property is a string representing the contents of
 * the file. The function also has a return type of `{ path: string; content: string }[] | undefined
 */
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

/**
 * The `createFileFactory` function creates a file factory object that provides methods for
 * manipulating files, such as updating files, reading file contents, searching directories, checking
 * file existence, deleting files, reading JSON files, and writing JSON files.
 * @param {FileFactoryOptions}  - - `baseDirectory`: The base directory where the files will be created
 * or searched.
 * @returns The function `createFileFactory` returns an object with the following properties and
 * corresponding values:
 */
export function createFileFactory({
  baseDirectory,
  errorHandler,
}: FileFactoryOptions) {
  const getFullPath = (filePath: string) => path.join(baseDirectory, filePath);

  /**
   * Updates multiple files with the provided data.
   *
   * @param {string[]} filePaths - An array of file paths to update.
   * @param {string} data - The data to write to the files.
   * @return {Promise<void>} A promise that resolves when all files have been updated.
   */
  const updateFiles = async (filePaths: string[], data: string) => {
    const promises = filePaths.map(async (filePath) => {
      const fullPath = getFullPath(filePath);
      await fs.promises.writeFile(fullPath, data);
    });
    await errorHandler.handleAsync(() => Promise.all(promises));
  };

/**
 * Reads the raw text content of multiple files asynchronously.
 *
 * @param {string[]} filePaths - An array of file paths to read.
 * @return {Promise<string[]>} A promise that resolves to an array of raw text content from the files.
 */
  const readFilesRawText = async (filePaths: string[]) => {
    const promises = filePaths.map(async (filePath) => {
      const fullPath = getFullPath(filePath);
      const data = await fs.promises.readFile(fullPath, "utf-8");
      return data;
    });
    return await errorHandler.handleAsync(() => Promise.all(promises));
  };

  
  /**
   * Searches for a file in the specified directory.
   *
   * @param {string} fileName - The name of the file to search for.
   * @return {Promise<boolean>} A promise that resolves to true if the file is found, and false otherwise.
   */
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

  /**
   * Deletes a file at the specified file path.
   *
   * @param {string} filePath - The path of the file to be deleted.
   * @return {Promise<void>} A promise that resolves when the file is successfully deleted.
   */
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

  /**
   * Writes JSON data to a file.
   *
   * @param {string} filePath - The path of the file to write the JSON data to.
   * @param {any} data - The JSON data to write to the file.
   * @return {Promise<void>} - A Promise that resolves when the file has been written.
   */
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
