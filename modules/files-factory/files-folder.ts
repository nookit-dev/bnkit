import fsPromise from "fs/promises";
import path from "path";

export type FileDirInfo = {
  type: "file" | "directory" | "other";
  name: string;
  fullPath: string;
  size: number;
  extension: string;
};
export type FileWithContent = FileDirInfo & {
  content: string;
  type: "file";
};

export const defaultDirIgnore = {
  node_modules: true,
  ".git": true,
  ".vscode": true,
  ".idea": true,
  cache: true,
};

export const defaultExtIgnore = {
  log: true,
  localstorage: true,
  DS_Store: true,
};

const recursiveFileSearch = async ({
  directory,
  searchString,
  ignoreDirectories = {},
  ignoreFileTypes = {},
}: {
  directory: string;
  searchString: string;
  ignoreDirectories?: Record<string, boolean>;
  ignoreFileTypes?: Record<string, boolean>;
}): Promise<FileDirInfo[]> => {
  const results: FileDirInfo[] = [];
  const entries = await fsPromise.readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory() && !ignoreDirectories[entry.name]) {
      const nestedResults = await recursiveFileSearch({
        directory: fullPath,
        searchString,
        ignoreDirectories,
        ignoreFileTypes,
      });
      results.push(...nestedResults);
    } else if (entry.isFile()) {
      const extension = path.extname(entry.name).slice(1);
      if (entry.name.includes(searchString) && !ignoreFileTypes[extension]) {
        const bunFileInfo = Bun.file(fullPath);
        results.push({
          type: "file",
          name: entry.name,
          fullPath,
          size: bunFileInfo.size,
          extension,
        });
      }
    }
  }

  return results;
};

const recursiveFileContentSearch = async ({
  directory,
  searchString,
  ignoreDirectories = {},
  ignoreFileTypes = {},
}: {
  directory: string;
  searchString: string;
  ignoreDirectories?: Record<string, boolean>;
  ignoreFileTypes?: Record<string, boolean>;
}): Promise<FileWithContent[]> => {
  const results: FileWithContent[] = [];
  const entries = await fsPromise.readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory() && !ignoreDirectories[entry.name]) {
      const nestedResults = await recursiveFileContentSearch({
        directory: fullPath,
        searchString,
        ignoreDirectories,
        ignoreFileTypes,
      });
      results.push(...nestedResults);
    } else if (entry.isFile()) {
      const extension = path.extname(entry.name).slice(1);
      if (!ignoreFileTypes[extension]) {
        const content = await Bun.file(fullPath).text();
        if (content.includes(searchString)) {
          const bunFileInfo = Bun.file(fullPath);
          results.push({
            type: "file",
            name: entry.name,
            fullPath,
            size: bunFileInfo.size,
            extension,
            content,
          });
        }
      }
    }
  }

  return results;
};

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

  const updateFiles = async (filePaths: string[], data: string) => {
    const promises = filePaths.map(async (filePath) => {
      const fullPath = getFullPath(filePath);
      await Bun.write(fullPath, data);
    });
    return Promise.all(promises);
  };

  const readFilesRawText = async (filePaths: string[]) => {
    try {
      const promises = filePaths.map(async (filePath) => {
        const fullPath = getFullPath(filePath);
        const data = await Bun.file(fullPath).text();
        return data;
      });

      return Promise.all(promises);
    } catch (error) {
      throw error;
    }
  };

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
      await Bun.file(fullPath).text(); // Trying to read the file to check its existence.
      return true;
    } catch (error) {
      return false; // Assuming error occurs if file doesn't exist.
    }
  };

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
      const rawText = await Bun.file(filePath).text();
      return JSON.parse(rawText);
    } catch (error) {
      console.error(`Error reading JSON file: ${error}`);
      throw error;
    }
  };

  const writeJson = async (filePath: string, data: any) => {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      await Bun.write(filePath, jsonString);
      return jsonString;
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
        console.info(`Created directory: ${directoryPath}`);
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

  const listFilesAndFolderInPath = async (
    dirPath: string
  ): Promise<FileDirInfo[]> => {
    try {
      const fullPath = getFullPath(dirPath);

      const entries = await fsPromise.readdir(fullPath, {
        withFileTypes: true,
      });

      const filesAndFolders = entries.map((entry): FileDirInfo => {
        const name = entry.name;
        const entryFullPath = path.join(fullPath, name);
        const bunFileInfo = Bun.file(entryFullPath);

        const type = entry.isFile()
          ? "file"
          : entry.isDirectory()
          ? "directory"
          : "other";

        let fileExtension = "folder";

        if (type === "file") {
          // parse extension from file path, if there is no extension, set it to 'file'
          // regex to parse extension from file path
          const regex = /(?:\.([^.]+))?$/;
          fileExtension = regex.exec(entryFullPath)?.[1] ?? "file";
        }

        return {
          type,
          name,
          fullPath: entryFullPath,
          extension: fileExtension,
          size: bunFileInfo.size,
        };
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
    recursiveFileSearch,
    recursiveFileContentSearch,
  };
}
