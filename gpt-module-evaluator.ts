import { fetchModuleFiles } from "@/files-folders";
import { ModuleName } from "@/generated/module-names";
import { fetchChatCompletion } from "@apps/beautiful-gpt/fetch-chat-completion";
import fs from "fs";
import path from "path";

const rootModulesPath = path.join(__dirname, "./modules");
export async function getReadmeContent(
  moduleName: ModuleName
): Promise<string> {
  const readmePath = path.join(rootModulesPath, moduleName, "README.md");
  if (fs.existsSync(readmePath)) {
    return fs.readFileSync(readmePath, "utf-8");
  }
  return "";
}

export async function generateMarkdownFromPromptForModule(
  moduleName: ModuleName,
  promptTemplate: string
): Promise<string | undefined> {
  const files = await fetchModuleFiles(rootModulesPath, moduleName);
  const currentReadme = await getReadmeContent(moduleName);

  // Prepare the file contents part of the prompt
  const fileContents = files
    .map((file) => `path: ${file.path}\n\nfile content:\n\n${file.content}\n\n`)
    .join("");

  // Generate the prompt
  const prompt = promptTemplate
    .replace("{moduleName}", moduleName)
    .replace("{currentReadme}", currentReadme)
    .replace("{fileContents}", fileContents);

  // Fetch chat completion
  const messages = await fetchChatCompletion(prompt);

  // Extract the assistant's response (assuming the first choice is the best one)
  const markdown = messages[0]?.content;

  return markdown;
}

// Usage example for generating a module improvement suggestions
const improvementPromptTemplate = `can you write me raw markdown based on what the module does, the module is called {moduleName}, the current readme is:\n\n{currentReadme}\n\nThe file contents are:\n\n{fileContents}\n\nWhat could be done to make the code easier to understand, improve performance, and increase efficiency while maintaining readability? Also, please check if there's any duplication that could be removed within the module.`;
console.log(
  await generateMarkdownFromPromptForModule(
    "fetch-utils",
    improvementPromptTemplate
  )
);
