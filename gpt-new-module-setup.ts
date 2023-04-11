// gpt-new-module-setup.ts
import { fetchModuleFiles } from "@/files-folders";
import { ModuleName } from "@/generated/module-names";
import { generateMarkdownFromPromptForModule } from "./gpt-module-evaluator";

interface RelevantModule {
  moduleName: ModuleName;
  fileContents: string;
}

async function getRelevantModules(): Promise<RelevantModule[]> {
  console.log("Fetching relevant modules...");

  const moduleNames: ModuleName[] = [
    "fetch-utils",
    "validations",
    "types",
    "files-folders",
  ];

  const relevantModules: RelevantModule[] = [];

  for (const moduleName of moduleNames) {
    const files = await fetchModuleFiles("./modules", moduleName);
    const fileContents = files
      .map(
        (file) => `path: ${file.path}\n\nfile content:\n\n${file.content}\n\n`
      )
      .join("");

    relevantModules.push({
      moduleName,
      fileContents,
    });
  }

  console.log("Relevant modules fetched.");

  return relevantModules;
}

async function setupNewModule(moduleName: ModuleName) {
  console.log(`Setting up new module: ${moduleName}`);

  console.log("Fetching relevant modules...");
  const relevantModules = await getRelevantModules();
  console.log("Relevant modules fetched.");

  const relevantModuleText = relevantModules
    .map(
      (module) =>
        `Module: ${module.moduleName}\n\nFile contents:\n\n${module.fileContents}`
    )
    .join("\n\n");

  console.log("Generating technical summary and analysis...");
  const analysisPromptTemplate = `Please analyze the code in the module called {moduleName}. The current readme is:\n\n{currentReadme}\n\nThe file contents are:\n\n{fileContents}\n\nPlease consider the following relevant modules:\n\n${relevantModuleText}\n\nWhat are some possible improvements and optimizations that can be made to the code?`;
  const analysis = await generateMarkdownFromPromptForModule(
    moduleName,
    analysisPromptTemplate
  );
  console.log("Technical summary and analysis generated.");

  console.log("Generating recommended starter code and README...");
  const starterCodePromptTemplate = `Based on the analysis of the module called {moduleName}, the current readme is:\n\n{currentReadme}\n\nThe file contents are:\n\n{fileContents}\n\nPlease provide some recommended starter code for the module and a README (separately).`;
  const starterCodeAndReadme = await generateMarkdownFromPromptForModule(
    moduleName,
    starterCodePromptTemplate
  );
  console.log("Recommended starter code and README generated.");

  console.log("New module setup completed.");
}

// Usage example:
setupNewModule("templating-engine");
