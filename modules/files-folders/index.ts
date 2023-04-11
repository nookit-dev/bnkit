import fs from "fs";
import path from "path";

export interface ModuleFile {
  path: string;
  content: string;
}

export async function fetchModuleFiles(
  rootModulesPath: string,
  moduleName: string
): Promise<ModuleFile[]> {
  const modulePath = path.join(rootModulesPath, moduleName);

  if (!fs.existsSync(modulePath)) {
    throw new Error(`Module "${moduleName}" not found.`);
  }

  const filenames = fs.readdirSync(modulePath);
  const files: ModuleFile[] = filenames
    .map((filename): ModuleFile | null => {
      const filePath = path.join(modulePath, filename);
      const stat = fs.statSync(filePath);
      if (stat.isFile()) {
        const content = fs.readFileSync(filePath, "utf-8");
        return { path: filePath, content };
      }
      return null;
    })
    .filter((file): file is ModuleFile => file !== null);

  return files;
}
