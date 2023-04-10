import Bun from "bun";

import { scaffoldingUtils } from "../code-generators";

export const modulesManager = async () => {
  // Ensure the project directory exists
  await scaffoldingUtils.ensureDirectoryExists("modules");

  // Create main entry file
  await scaffoldingUtils.createFileWithContent("modules/index.ts", "");

  // Read module directories from ./modules
  const modules = await scaffoldingUtils.getModulesFromPath("modules");

  const results: Record<string, string[]> = {
    created: [],
    overwritten: [],
    skipped: [],
  };

  // Process each module
  for (const moduleName of modules) {
    const modulePath = `modules/${moduleName}`;

    // Check if the module has default content or doesn't exist
    if (await scaffoldingUtils.isDefaultModule(modulePath, moduleName)) {
      const isNew = Bun.file(modulePath).size === 0;
      isNew
        ? results.created.push(moduleName)
        : results.overwritten.push(moduleName);

      // Scaffold the module
      await scaffoldingUtils.scaffoldModule(moduleName, modulePath);
    } else {
      results.skipped.push(moduleName);
    }
  }

  // Update modules/index.ts with proper exports
  scaffoldingUtils.updateIndexExports(modules);

  // Generate a TypeScript file with a union type containing all module names
  scaffoldingUtils.generateModuleNamesType(modules);

  console.log(`Created modules: ${results.created.join(", ")}`);
  console.log(`Overwritten modules: ${results.overwritten.join(", ")}`);
  console.log(`Skipped modules: ${results.skipped.join(", ")}`);
};
