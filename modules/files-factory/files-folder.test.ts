import fsPromise from "fs/promises";

import { describe, expect, it } from "bun:test";
import { defaultErrorHandler } from "../..";
import { createFileFactory, saveResultToFile } from "./files-folder";

const getTestFactory = () => {
  return createFileFactory({
    baseDirectory: ".",
    errorHandler: defaultErrorHandler(),
  });
};

// Tests that saveResultToFile saves the given content to a file at the specified file path
it("saves content to file", async () => {
  const filePath = "./test/test-files/test.txt";
  const content = "Hello, world!";
  await saveResultToFile(filePath, content);
  const fileContent = await fsPromise.readFile(filePath, "utf-8");
  expect(fileContent).toEqual(content);

  const factory = getTestFactory();

  //   delete file
  await factory.deleteFile(filePath);

  // expect file to no longer be there
  try {
    await fsPromise.access(filePath, fsPromise.constants.F_OK);
    throw new Error("File should not exist");
  } catch (e: any) {
    if (e.code === "ENOENT") {
      // This is expected as the file should not exist
    } else {
      // If the error is something else, re-throw it
      throw e;
    }
  }
});

describe("createFileFactory", async () => {
  // Test that readFilesRawText reads the content of multiple files correctly
  it("reads multiple files", async () => {
    const factory = getTestFactory();
    const filePaths = [
      "./test/test-files/test1.txt",
      "./test/test-files/test2.txt",
    ];
    const contents = ["Hello, world!", "Goodbye, world!"];
    for (let i = 0; i < filePaths.length; i++) {
      await saveResultToFile(filePaths[i], contents[i]);
    }
    const fileContents = await factory.readFilesRawText(filePaths);
    expect(fileContents).toEqual(contents);
    for (let filePath of filePaths) {
      await factory.deleteFile(filePath);
    }
  });

  // Test that updateFiles updates the content of multiple files correctly
  it("updates multiple files", async () => {
    const factory = getTestFactory();
    const filePaths = [
      "./test/test-files/test1.txt",
      "./test/test-files/test2.txt",
    ];
    const initialContents = ["Hello, world!", "Goodbye, world!"];
    const newContents = "Updated content";
    for (let i = 0; i < filePaths.length; i++) {
      await saveResultToFile(filePaths[i], initialContents[i]);
    }
    await factory.updateFiles(filePaths, newContents);
    for (let filePath of filePaths) {
      const fileContent = await fsPromise.readFile(filePath, "utf-8");
      expect(fileContent).toEqual(newContents);
      await factory.deleteFile(filePath);
    }
  });

  // Test that searchDirectory can correctly find a file in the specified directory
  it("searches directory for file", async () => {
    const factory = getTestFactory();
    const fileName = "test.txt";
    const filePath = `./test/test-files/${fileName}`;
    const content = "Hello, world!";
    await saveResultToFile(filePath, content);
    const fileExists = await factory.searchDirectory(fileName);
    expect(fileExists).toEqual(true);
    await factory.deleteFile(filePath);
  });

  // Test that fileExists correctly identifies if a file exists at the given path
  it("checks if file exists", async () => {
    const factory = getTestFactory();
    const fileName = "test.txt";
    const filePath = `./test/test-files/${fileName}`;
    const content = "Hello, world!";
    await saveResultToFile(filePath, content);
    const fileExists = await factory.fileExists(filePath);
    expect(fileExists).toEqual(true);
    await factory.deleteFile(filePath);
  });

  // Test that deleteFile deletes a file correctly
  it("deletes a file", async () => {
    const factory = getTestFactory();
    const fileName = "test.txt";
    const filePath = `./test/test-files/${fileName}`;
    const content = "Hello, world!";
    await saveResultToFile(filePath, content);
    await factory.deleteFile(filePath);
    const fileExistsAfterDeletion = await factory.fileExists(filePath);
    expect(fileExistsAfterDeletion).toEqual(false);
  });

  // Test that readJson reads a JSON file correctly
  it("reads JSON file", async () => {
    const factory = getTestFactory();
    const fileName = "test.json";
    const filePath = `./test/test-files/${fileName}`;
    const jsonContent = { greeting: "Hello, world!" };
    await fsPromise.writeFile(filePath, JSON.stringify(jsonContent));
    const content = await factory.readJson(filePath);
    expect(content).toEqual(jsonContent);
    await factory.deleteFile(filePath);
  });

  // Test that writeJson writes a JSON object to a file correctly
  it("writes JSON file", async () => {
    const factory = getTestFactory();
    const fileName = "test.json";
    const filePath = `./${fileName}`;

    const jsonContent = { farewell: "Goodbye, world!" };
    try {
      await factory.writeJson(filePath, jsonContent);
    } catch (error) {
      console.error(error);
    }

    let fileContent = "";

    try {
      fileContent = JSON.parse(await fsPromise.readFile(filePath, "utf-8"));
    } catch (e) {
      console.error(e);
    }


    expect(fileContent).toEqual(jsonContent);

    try {
      await factory.deleteFile(filePath);
    } catch (error) {
      console.error(error);
    }
  });
});
