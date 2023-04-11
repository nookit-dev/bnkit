import { generateMarkdownFromPromptForModule } from "gpt-module-evaluator";

const customPrompt = `Please analyze the code in the module called {moduleName}. The current readme is:\n\n{currentReadme}\n\nThe file contents are:\n\n{fileContents}\n\nWhat are some possible improvements and optimizations that can be made to the code?`;

console.log(
  await generateMarkdownFromPromptForModule("fetch-utils", customPrompt)
);
