import { defaultErrorHandler } from "error-handler-factory/default-error-handler";
import { createFetchFactory } from "fetch-factory/create-fetch-factory";

type CompletionChoice = {
  message: {
    role: string;
    content: string;
  };
  index: number;
  finish_reason: string;
};

export type CompletionsResponse = {
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

type BaseOpenAICompletionsParams = {
  numCompletions?: number;
  maxTokens?: number;
  apiKey?: string;
  // ID of the model to use
  model?: string;
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
    }: BaseOpenAICompletionsParams): Promise<CompletionsResponse> {
      const baseUrl = "https://api.openai.com/";
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };

      const body = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `$${prompt}` }],
      };

      const completionsEndpoint = "v1/chat/completions";

      console.log(`Creating request to ${baseUrl} ${completionsEndpoint}`);

      const fetchCompletions = createFetchFactory({
        baseUrl,
        errorHandler: defaultErrorHandler(),
      });

      try {
        const { data } = await fetchCompletions.postJson<CompletionsResponse>({
          endpoint: completionsEndpoint,
          headers,
          params: body,
        });

        return data;
      } catch (error) {
        console.error("Error fetching completions:", error);
        throw error;
      }
    },
  };
};

export default createOpenAICompletions;
