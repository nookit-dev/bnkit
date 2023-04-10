// RUN THIS FILE WHEN CREATING A NEW MODULE
import fs from "fs";
import path from "path";

const srcPath = path.join(__dirname, "modules");

function generateModuleNamesType(moduleNames: string[]): void {
  const typeFilePath = path.join(srcPath, "generated", "module-names.ts");
  ensureDirectoryExists(path.dirname(typeFilePath));

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
  const indexFilePath = path.join(srcPath, "index.ts");
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
function ensureDirectoryExists(directoryPath: string) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

// Create a file with the specified content
function createFileWithContent(filePath: string, content: string) {
  fs.writeFileSync(filePath, content);
}

// Create a package.json file in the specified modulePath with the specified moduleName
function createPackageJson(modulePath: string, moduleName: string) {
  createFileWithContent(
    path.join(modulePath, "package.json"),
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
function getModulesFromPath(directoryPath: string) {
  return fs
    .readdirSync(directoryPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

// Check if a module has default content (empty index.ts file and a README.md with just the module name)
function isDefaultModule(modulePath: string, moduleName: string) {
  const indexFilePath = path.join(modulePath, "index.ts");
  const readmeFilePath = path.join(modulePath, "README.md");

  if (!fs.existsSync(modulePath)) {
    return true;
  }

  // Check if the module directory is empty
  const directoryContents = fs.readdirSync(modulePath);
  if (directoryContents.length === 0) {
    return true;
  }

  // Check if the module has default content
  return (
    fs.existsSync(indexFilePath) &&
    fs.existsSync(readmeFilePath) &&
    fs.readFileSync(indexFilePath, "utf-8") === "" &&
    fs.readFileSync(readmeFilePath, "utf-8") === `# ${moduleName}\n`
  );
}

// Create or overwrite a module by scaffolding its directory, index.ts, README.md, test directory, moduleName.test.ts, and package.json
function scaffoldModule(moduleName: string, modulePath: string) {
  // Create module directory, index.ts, README.md, and test directory with moduleName.test.ts
  ensureDirectoryExists(modulePath);

  const formattedModuleName = formatModuleName(moduleName);

  // Add a named export to the index.ts file for each module
  createFileWithContent(
    path.join(modulePath, "index.ts"),
    `export const ${formattedModuleName} = {};\n`
  );

  createFileWithContent(
    path.join(modulePath, "README.md"),
    `# ${moduleName}\n`
  );

  const testPath = path.join(modulePath, "test");
  ensureDirectoryExists(testPath);
  createFileWithContent(path.join(testPath, `${moduleName}.test.ts`), "");

  createPackageJson(modulePath, moduleName);
}

// Ensure the project directory exists
ensureDirectoryExists(srcPath);

// Create main entry file
createFileWithContent(path.join(srcPath, "index.ts"), "");

// Read module directories from ./modules
const modules = getModulesFromPath(srcPath);

const results: Record<string, string[]> = {
  created: [],
  overwritten: [],
  skipped: [],
};

// Process each module
modules.forEach((moduleName) => {
  const modulePath = path.join(srcPath, moduleName);

  // Check if the module has default content or doesn't exist
  if (isDefaultModule(modulePath, moduleName)) {
    const isNew = !fs.existsSync(modulePath);
    isNew
      ? results.created.push(moduleName)
      : results.overwritten.push(moduleName);

    // Scaffold the module
    scaffoldModule(moduleName, modulePath);
  } else {
    results.skipped.push(moduleName);
  }
});

// Update modules/index.ts with proper exports
updateIndexExports(modules);

// Generate a TypeScript file with a union type containing all module names
generateModuleNamesType(modules);

console.log(`Created modules: ${results.created.join(", ")}`);
console.log(`Overwritten modules: ${results.overwritten.join(", ")}`);
console.log(`Skipped modules: ${results.skipped.join(", ")}`);
