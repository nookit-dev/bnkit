import Bun from "bun";

function generateModuleNamesType(moduleNames: string[]): void {
  const typeFilePath = "modules/generated/module-names.ts";
  ensureDirectoryExists("modules/generated");

  const typeContent = `// Auto-generated file. Do not edit directly.
export type ModuleName = ${moduleNames.map((name) => `'${name}'`).join(" | ")};
`;

  createFileWithContent(typeFilePath, typeContent);
}

function formatModuleName(moduleName: string): string {
  return moduleName
    .split("-")
    .map((word, index) =>
      index > 0 ? word[0].toUpperCase() + word.slice(1) : word
    )
    .join("");
}

function updateIndexExports(modules: string[]) {
  const indexFilePath = "modules/index.ts";
  const exportsContent = modules
    .map((moduleName) => {
      const exportName = moduleName.replace(/[-_](.)/g, (_, letter) =>
        letter.toUpperCase()
      );
      return `export * as ${exportName} from './${moduleName}';`;
    })
    .join("\n");

  createFileWithContent(indexFilePath, exportsContent);
}

// Ensure a directory exists by creating it if it doesn't
async function ensureDirectoryExists(directoryPath: string) {
  try {
    await Bun.write(directoryPath, "");
  } catch (error) {
    console.error(`Failed to ensure directory exists: ${error}`);
  }
}

// Create a file with the specified content
async function createFileWithContent(filePath: string, content: string) {
  try {
    await Bun.write(filePath, content);
  } catch (error) {
    console.error(`Failed to create file with content: ${error}`);
  }
}

// Create a package.json file in the specified modulePath with the specified moduleName
async function createPackageJson(modulePath: string, moduleName: string) {
  await createFileWithContent(
    `${modulePath}/package.json`,
    JSON.stringify(
      {
        name: moduleName,
        module: "index.ts",
        type: "module",
        devDependencies: {
          "bun-types": "^0.5.0",
        },
      },
      null,
      2
    )
  );
}

// Get module names by reading the directory names in the specified directoryPath
async function getModulesFromPath(directoryPath: string) {
  const directory = Bun.file(directoryPath);
  const directoryContents = await directory.text();
  return directoryContents
    .split("\n")
    .filter((line) => line && !line.endsWith("."))
    .map((line) => line.trim());
}

// Check if a module has default content (empty index.ts file and a README.md with just the module name)
async function isDefaultModule(modulePath: string, moduleName: string) {
  const indexFilePath = `${modulePath}/index.ts`;
  const readmeFilePath = `${modulePath}/README.md`;

  const indexFile = Bun.file(indexFilePath);
  const readmeFile = Bun.file(readmeFilePath);

  if (indexFile.size === 0 && readmeFile.size === 0) {
    return true;
  }

  const indexContent = await indexFile.text();
  const readmeContent = await readmeFile.text();

  return indexContent === "" && readmeContent === `# ${moduleName}\n`;
}
// Create or overwrite a module by scaffolding its directory, index.ts, README.md, test directory, moduleName.test.ts, and package.json
async function scaffoldModule(moduleName: string, modulePath: string) {
  // Create module directory, index.ts, README.md, and test directory with moduleName.test.ts
  await ensureDirectoryExists(modulePath);

  const formattedModuleName = formatModuleName(moduleName);

  // Add a named export to the index.ts file for each module
  await createFileWithContent(
    `${modulePath}/index.ts`,
    `export const ${formattedModuleName} = {};\n`
  );

  await createFileWithContent(`${modulePath}/README.md`, `# ${moduleName}\n`);

  const testPath = `${modulePath}/test`;
  await ensureDirectoryExists(testPath);
  await createFileWithContent(`${testPath}/${moduleName}.test.ts`, "");

  await createPackageJson(modulePath, moduleName);
}

export {
  ensureDirectoryExists,
  createFileWithContent,
  getModulesFromPath,
  isDefaultModule,
  scaffoldModule,
  updateIndexExports,
  generateModuleNamesType,
  formatModuleName,
  createPackageJson,
};
