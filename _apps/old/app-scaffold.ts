import {
    createFileWithContent,
    createPackageJson,
    ensureDirectoryExists,
    formatModuleName,
} from "@/code-generators/scaffolding-utils";
import path from "path";

// Create or overwrite an app by scaffolding its directory, index.ts, README.md, .env, .env.example, test directory, appName.test.ts, and package.json
export function scaffoldApp(appName: string, appPath: string) {
  // Create app directory, index.ts, README.md, .env, .env.example, and test directory with appName.test.ts
  ensureDirectoryExists(appPath);

  const formattedAppName = formatModuleName(appName);

  // Add a named export to the index.ts file for each app
  createFileWithContent(
    path.join(appPath, "index.ts"),
    `export const ${formattedAppName} = {};\n`
  );

  createFileWithContent(path.join(appPath, "README.md"), `# ${appName}\n`);

  createFileWithContent(path.join(appPath, ".env"), "");
  createFileWithContent(path.join(appPath, ".env.example"), "");

  const testPath = path.join(appPath, "test");
  ensureDirectoryExists(testPath);
  createFileWithContent(path.join(testPath, `${appName}.test.ts`), "");

  createPackageJson(appPath, appName);
}
