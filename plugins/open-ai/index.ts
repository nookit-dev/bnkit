import { createOpenAICompletions } from "./open-ai-completions-api";
import { createOpenAIFiles } from "./open-ai-files-api";
import { createOpenAIFineTune } from "./open-ai-fine-tune-api";

export const openAIFetcher = {
  files: createOpenAIFiles,
  fineTune: createOpenAIFineTune,
  completions: createOpenAICompletions,
};
