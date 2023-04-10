import fs from "fs";
import path from "path";

const modules = [
  "sqlite-interface"
];

const srcPath = path.join(__dirname, "packages");

// Create project directory
fs.mkdirSync(srcPath, { recursive: true });

// Create main entry file
fs.writeFileSync(path.join(srcPath, "index.ts"), "");

// Create module directories and files
modules.forEach((moduleName) => {
  const modulePath = path.join(srcPath, moduleName);
  fs.mkdirSync(modulePath, { recursive: true });

  // Create index.ts file for each module
  fs.writeFileSync(path.join(modulePath, "index.ts"), "");

  // Create test directory for each module
  const testPath = path.join(modulePath, "test");
  fs.mkdirSync(testPath, { recursive: true });
});
