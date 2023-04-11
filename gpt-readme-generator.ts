import { generateMarkdownFromPromptForModule } from "./gpt-module-evaluator";

// Usage example for generating a module README
const readmePromptTemplate = `can you write me raw markdown based on what the module does, the module is called {moduleName}, the current readme is:\n\n[FILL_IN_READ_ME]\n\nThe file contents are:\n\n{fileContents}`;
console.log(
  await generateMarkdownFromPromptForModule("fetch-utils", readmePromptTemplate)
);
