import { createFetcher } from "./fetcher";

type CompletionChoice = {
  text: string;
  index: number;
  logprobs: any; // Replace 'any' with the specific logprobs structure if needed
  finish_reason: string;
};

type CompletionsResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: CompletionChoice[];
};

// Set up the fetcher function
const fetchCompletions = createFetcher<CompletionsResponse, "APIError">();

type BaseOpenAICompletionsParams = {
  prompt: string;
  numCompletions?: number;
  maxTokens?: number;
  apiKey?: string;
};

const createOpenAICompletions = ({ apiKey }: { apiKey: string }) => {
  return {
    async getCompletions({
      prompt,
      maxTokens,
      numCompletions = 1,
    }: BaseOpenAICompletionsParams) {
      const url = "https://api.openai.com/v1/engines/davinci-codex/completions";
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };
      const body = JSON.stringify({
        prompt,
        max_tokens: maxTokens,
        n: numCompletions,
      });

      try {
        const response = await (
          await fetchCompletions
        )(url, {
          method: "POST",
          headers,
          body,
        });

        return response.choices;
      } catch (error) {
        console.error("Error fetching completions:", error);
        throw error;
      }
    },
  };
};

export default createOpenAICompletions;
