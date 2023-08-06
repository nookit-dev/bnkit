import fsPromise from "fs/promises";
import path from "path";

export type FileDirInfo = {
  type: "file" | "directory" | "other";
  name: string;
  fullPath: string;
};

/**
 * The `saveResultToFile` function saves the given content to a file at the specified file path.
 * @param {string} filePath - A string representing the file path where the result will be saved.
 * @param {string} content - The `content` parameter is a string that represents the content that you
 * want to save to a file.
 */
export const saveResultToFile = async (
  filePath: string,
  content: string
): Promise<void> => {
  try {
    const resolvedPath = path.resolve(filePath);
    await fsPromise.mkdir(path.dirname(resolvedPath), { recursive: true });
    await fsPromise.writeFile(resolvedPath, content);
  } catch (err: any) {
    throw new Error(`Failed to save result to file: ${err?.message}`);
  }
};

// Helper function to read content of a single file
async function readFileContent(
  filePath: string
): Promise<{ path: string; content: string }> {
  try {
    const filename = path.basename(filePath);
    const content = await fsPromise.readFile(filePath, "utf8");
    return { path: filename, content };
  } catch (error) {
    throw error;
  }
}

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
export const readFilesContents = async (
  filePaths: string[]
): Promise<{ path: string; content: string }[] | undefined> => {
  try {
    return Promise.all(
      filePaths.map(async (filePath) => readFileContent(filePath))
    );
  } catch (error) {
    throw error;
  }
};

export const readFileContents = async (
  filePath: string
): Promise<{ path: string; content: string } | undefined> => {
  try {
    return readFileContent(filePath);
  } catch (error) {
    throw error;
  }
};

type FileFactoryOptions = {
  baseDirectory: string;
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
export function createFileFactory({ baseDirectory }: FileFactoryOptions) {
  const getFullPath = (filePath: string) => {
    try {
      // Check if filePath is absolute. If it is, just return it.
      if (path.isAbsolute(filePath)) {
        return filePath;
      } else {
        // Otherwise, join it with baseDirectory and return it.
        return path.join(baseDirectory, filePath);
      }
    } catch (e) {
      throw e;
    }
  };

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
      await fsPromise.writeFile(fullPath, data);
    });
    return Promise.all(promises);
  };

  /**
   * Reads the raw text content of multiple files asynchronously.
   *
   * @param {string[]} filePaths - An array of file paths to read.
   * @return {Promise<string[]>} A promise that resolves to an array of raw text content from the files.
   */
  const readFilesRawText = async (filePaths: string[]) => {
    try {
      const promises = filePaths.map(async (filePath) => {
        const fullPath = getFullPath(filePath);
        const data = await fsPromise.readFile(fullPath, "utf-8");
        return data;
      });

      return Promise.all(promises);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Searches for a file in the specified directory.
   *
   * @param {string} fileName - The name of the file to search for.
   * @return {Promise<boolean>} A promise that resolves to true if the file is found, and false otherwise.
   */

  const searchDirectory = async (fileName: string) => {
    async function searchDir(dir: string): Promise<boolean> {
      const entries = await fsPromise.readdir(dir, { withFileTypes: true });
      for (let entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (await searchDir(fullPath)) {
            return true;
          }
        } else if (entry.name === fileName) {
          return true;
        }
      }
      return false;
    }
    return searchDir(baseDirectory);
  };

  const fileExists = async (filePath: string) => {
    const fullPath = getFullPath(filePath);
    try {
      await fsPromise.access(fullPath, fsPromise.constants.F_OK);
      return true;
    } catch (error) {
      return false;
    }
  };

  /**
   * Deletes a file at the specified file path.
   *
   * @param {string} filePath - The path of the file to be deleted.
   * @return {Promise<void>} A promise that resolves when the file is successfully deleted.
   */
  const deleteFile = async (filePath: string) => {
    try {
      const fullPath = getFullPath(filePath);

      return fsPromise.unlink(fullPath);
    } catch (e) {
      throw e;
    }
  };

  const readJson = async (filePath: string) => {
    try {
      const rawText = await fsPromise.readFile(filePath, "utf8");
      return JSON.parse(rawText);
    } catch (error) {
      console.error(`Error reading JSON file: ${error}`);
      throw error;
    }
  };

  /**
   * Writes JSON data to a file.
   *
   * @param {string} filePath - The path of the file to write the JSON data to.
   * @param {any} data - The JSON data to write to the file.
   * @return {Promise<void>} - A Promise that resolves when the file has been written.
   */
  const writeJson = async (filePath: string, data: any) => {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const dir = path.dirname(filePath);

      console.log({ dir, filePath });
      await fsPromise.mkdir(dir, { recursive: true });
      await updateFiles([filePath], jsonString);
    } catch (error: any) {
      throw error;
    }
  };

  async function directoryExists(directoryPath: string) {
    try {
      // Try accessing the directory
      await fsPromise.access(directoryPath, fsPromise.constants.F_OK);
    } catch (error) {
      // If access failed because the directory doesn't exist, create the directory
      if (error.code === "ENOENT") {
        await fsPromise.mkdir(directoryPath, { recursive: true });
        console.log(`Created directory: ${directoryPath}`);
      } else {
        // If access failed for any other reason, throw the error
        throw error;
      }
    }
  }

  const createFileWithContent = async (filePath: string, content: string) => {
    const fullPath = getFullPath(filePath);

    // Check if the directory of the file exists, if not create it
    const directoryPath = path.dirname(fullPath);
    await directoryExists(directoryPath);

    // Write the content to the file
    await fsPromise.writeFile(fullPath, content);
  };

  /**
   * Retrieves a list of files and folders in the specified directory path.
   *
   * @param {string} dirPath - The path of the directory to retrieve the files and folders from.
   * @return {Array<Object>} An array of objects containing information about each file and folder in the directory.
   * Each object has the properties: type (file, directory, other), name (the name of the file or folder), and fullPath (the full path of the file or folder).
   */
  const listFilesAndFolderInPath = async (
    dirPath: string
  ): Promise<FileDirInfo[]> => {
    try {
      const fullPath = getFullPath(dirPath);

      const entries = await fsPromise.readdir(fullPath, {
        withFileTypes: true,
      });

      const filesAndFolders: FileDirInfo[] = entries.map((entry) => {
        const type = entry.isFile()
          ? "file"
          : entry.isDirectory()
          ? "directory"
          : "other";
        const name = entry.name;
        const entryFullPath = path.join(fullPath, name);
        return { type, name, fullPath: entryFullPath };
      });

      return filesAndFolders;
    } catch (e) {
      throw e;
    }
  };

  return {
    updateFiles,
    readFilesRawText,
    searchDirectory,
    fileExists,
    deleteFile,
    readJson,
    writeJson,
    directoryExists,
    createFileWithContent,
    listFilesAndFolderInPath,
  };
}
