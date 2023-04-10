const OPENAI_API_KEY = Bun.env.OPENAI_API_KEY;

import { fetchUtils } from "@/fetch-utils";

const { fetcher } = fetchUtils;

type ChatCompletionResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: Array<{
    text: string;
    index: number;
    logprobs: object;
    finish_reason: string;
  }>;
};

export async function fetchChatCompletion(
  prompt: string,
  debug?: boolean
): Promise<ChatCompletionResponse> {
  const endpoint = "https://api.openai.com/v1/chat/completions";

  if (debug) {
    console.log({endpoint, prompt});
  }

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    }),
  };

  if (debug) {
    console.log(options)
  }
    
  return await fetcher<ChatCompletionResponse>(endpoint, options);
}
