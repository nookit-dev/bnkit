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
  numCompletions?: number;
  maxTokens?: number;
  apiKey?: string;
  // ID of the model to use
  model: string;
  // The prompt(s) to generate completions for
  prompt?: string | string[] | number[] | number[][];

  // The suffix that comes after a completion of inserted text
  suffix?: string;

  // The maximum number of tokens to generate in the completion
  //2048 default newest models support 4096
  max_tokens?: number;

  // The sampling temperature to use, between 0 and 2
  temperature?: number;

  // The alternative to sampling with temperature, nucleus sampling
  top_p?: number;

  // How many completions to generate for each prompt
  n?: number;

  // Whether to stream back partial progress
  stream?: boolean;

  // Include the log probabilities on the most likely tokens
  logprobs?: number;

  // Echo back the prompt in addition to the completion
  echo?: boolean;

  // Up to 4 sequences where the API will stop generating further tokens
  stop?: string | string[];

  // Penalize new tokens based on whether they appear in the text so far
  presence_penalty?: number;

  // Penalize new tokens based on their existing frequency in the text so far
  frequency_penalty?: number;

  // Generates completions server-side and returns the "best" completion
  best_of?: number;

  // Modify the likelihood of specified tokens appearing in the completion
  logit_bias?: Record<number, number>;

  // A unique identifier representing your end-user
  user?: string;
};

const createOpenAICompletions = ({ apiKey }: { apiKey: string }) => {
  return {
    async getCompletions({
      prompt,
      maxTokens,
      numCompletions = 1,
    }: BaseOpenAICompletionsParams) {
      const url = "https://api.openai.com/v1/chat/completions";
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };

      const body = JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `$${prompt}` }],
        // max_tokens: maxTokens,
        // n: numCompletions,
      });

      console.log({
        prompt,
        url,
        headers,
        body,
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
