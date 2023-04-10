const OPENAI_API_KEY = Bun.env.OPENAI_API_KEY;

import { fetcher } from "@/fetch-utils";

interface OpenAICompletionsResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: Usage;
  choices: Choice[];
}

interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

interface Choice {
  message: Message;
  finish_reason: string;
  index: number;
}

interface Message {
  role: string;
  content: string;
}

export async function fetchChatCompletion(
  prompt: string,
  debug?: boolean
): Promise<Message[]> {
  const endpoint = "https://api.openai.com/v1/chat/completions";

  if (debug) {
    console.log({ endpoint, prompt });
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
    console.log(options);
  }

  const response = await fetcher<OpenAICompletionsResponse>(endpoint, options);

  const messages: Message[] = [];

  response.choices.forEach((choice) => {
    messages.push(choice.message);
  });

  return messages;
}
