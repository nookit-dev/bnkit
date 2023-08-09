import { createFetchFactory } from "../fetch-factory/create-fetch-factory";

export type CompletionChoice = {
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

export type BaseOpenAICompletionsParams = {
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

export type ModelInfo = {
  id: string;
  object: string;
  owned_by: string;
  permission: any[]; // Use specific type if you know the structure of permission
};

export type ModelsListResponse = {
  data: ModelInfo[];
  object: string;
};

export type RetrieveModelResponse = ModelInfo;

export const createOpenAICompletions = ({ apiKey }: { apiKey: string }) => {
  const baseUrl = "https://api.openai.com";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  const completionsEndpoint = "/v1/chat/completions";
  const modelsEndpoint = "/v1/models";

  const openAiAPI = createFetchFactory({
    baseUrl,
  });

  return {
    async getCompletions({
      prompt,
      model = "gpt-3.5-turbo",
      maxTokens,
      numCompletions = 1,
    }: BaseOpenAICompletionsParams): Promise<CompletionsResponse> {
      const body = {
        model,
        messages: [{ role: "user", content: `$${prompt}` }],
      };

      try {
        const { data } = await openAiAPI.post<CompletionsResponse>({
          endpoint: completionsEndpoint,
          headers,
          postData: body,
        });

        return data;
      } catch (error) {
        console.error("Error fetching completions:", error);
        throw error;
      }
    },
    async listModels(): Promise<ModelsListResponse> {
      try {
        const { data } = await openAiAPI.get<ModelsListResponse>({
          endpoint: modelsEndpoint,
          headers,
        });
        return data;
      } catch (error) {
        console.error("Error fetching list of models:", error);
        throw error;
      }
    },

    // New method to retrieve a specific model by its ID
    async retrieveModel(modelId: string): Promise<RetrieveModelResponse> {
      try {
        const { data } = await openAiAPI.get<RetrieveModelResponse>({
          endpoint: `${modelsEndpoint}/${modelId}`,
          headers,
        });
        return data;
      } catch (error) {
        console.error(`Error fetching model with ID ${modelId}:`, error);
        throw error;
      }
    },
  };
};

export default createOpenAICompletions;
