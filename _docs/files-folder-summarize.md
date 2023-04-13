This module provides functions for getting a list of files within a directory, ignoring specified files, and finding the root directory of the current project. The main exports are:

- getFilesForDirectory(directory, { ignoreFiles }): returns a list of files within a specified directory, filtering out any files listed in the ignoreFiles array
- getFilesForDirectoryFromRoot(directory, { ignoreFiles }): same as getFilesForDirectory, but finds the root directory of the current project first
- isRootFolder(folderPath): checks if a given folder is the root directory of the project based on a specified condition (e.g. presence of a certain file)
- findAppRoot(startingPath): starting from a given path, finds the root directory of the project by repeatedly checking parent directories until a root folder is found.