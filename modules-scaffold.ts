// RUN THIS FILE WHEN CREATING A NEW MODULE
import {
  createFileWithContent,
  ensureDirectoryExists,
  generateModuleNamesType,
  getModulesFromPath,
  isDefaultModule,
  scaffoldModule,
  updateIndexExports,
} from "@/code-generators/scaffolding-utils";
import fs from "fs";
import path from "path";

const srcPath = path.join(__dirname, "modules");

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
updateIndexExports(srcPath, modules);

// Generate a TypeScript file with a union type containing all module names
generateModuleNamesType(srcPath, modules);

console.log(`Created modules: ${results.created.join(", ")}`);
console.log(`Overwritten modules: ${results.overwritten.join(", ")}`);
console.log(`Skipped modules: ${results.skipped.join(", ")}`);
