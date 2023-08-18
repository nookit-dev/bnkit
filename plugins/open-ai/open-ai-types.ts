export type OpenAIFileObject = {
  id: string;
  object: string;
  bytes: number;
  created_at: number;
  filename: string;
  purpose: string;
};

export type FilesListResponse = {
  object: string;
  data: OpenAIFileObject[];
};

export type FineTuneEvent = {
  object: string;
  created_at: number;
  level: string;
  message: string;
};

export type FineTuneFile = {
  id: string;
  object: string;
  bytes: number;
  created_at: number;
  filename: string;
  purpose: string;
};

export type FineTuneParams = {
  batch_size?: number;
  learning_rate_multiplier?: number;
  n_epochs?: number;
  prompt_loss_weight?: number;
};

export type FineTuneResponse = {
  id: string;
  object: string;
  model: string;
  created_at: number;
  events: FineTuneEvent[];
  fine_tuned_model: string;
  hyperparams: FineTuneParams;
  organization_id: string;
  result_files: FineTuneFile[];
  status: string;
  validation_files: FineTuneFile[];
  training_files: FineTuneFile[];
  updated_at: number;
};

export type FineTunesListResponse = {
  object: string;
  data: FineTuneResponse[];
};

export type CompletionChoice = {
  message: {
    role: string;
    content: string;
  };
  index: number;
  finish_reason: string;
};
/* legacy api */
export type TraditionalCompletionsResponse = {
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

export type CompletionsParams = {
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

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ChatCompletionChoice = {
  index: number;
  message: ChatMessage;
  finish_reason: string;
};

export type ChatCompletionResponse = {
  id: string;
  object: "chat.completion";
  created: number;
  model: string;
  choices: ChatCompletionChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type ChatCompletionChunkChoice = {
  index: number;
  delta: {
    content: string;
  };
  finish_reason: string;
};

export type ChatCompletionChunkResponse = {
  id: string;
  object: "chat.completion.chunk";
  created: number;
  model: string;
  choices: ChatCompletionChunkChoice[];
};

export type ListModelsParams = {};

export type RetrieveModelParams = {
  modelId: string;
};

export type FilesParams = {};

export type CreateFileParams = {
  formData: FormData;
};

export type RetrieveFileParams = {
  fileId: string;
};

export type DeleteFileParams = {
  fileId: string;
};

export type ChatCompletionParams = {
  model: string;
  messages: ChatMessage[];
};

export type ListFineTunesParams = {};

export type RetrieveFineTuneParams = {
  fineTuneId: string;
};

export type ListFineTuneEventsParams = {
  fineTuneId: string;
};

export type CancelFineTuneParams = {
  fineTuneId: string;
};
