import { createBeautifulGpt } from "./create-beautiful-gpt";
import { fetchChatCompletion } from "./fetch-chat-completion";

//updated completions response
export interface OpenAICompletionsResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: Usage;
  choices: Choice[];
}

export interface Choice {
  message: Message;
  finish_reason: string;
  index: number;
}

export interface Message {
  role: string;
  content: string;
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

const beGpt = createBeautifulGpt();

const fruitDataResponseSchema = {
  name: "string",
  calories: "number",
  fatsGrams: "number",
  proteinsGrams: "number",
} as const;

console.log(beGpt);

const fetcher = await fetchChatCompletion(`
2 foods that are roughly 200 calories each
Return Data as JSON format, below is expected JSON format. The keys are the field names and the value is the expect type of that field::


{
  "name": "string",
  "calories": "number",
  "fatsGrams": "number",
  "proteinsGrams": "number"
}
`);

// TODO need tofix the  type inferencing
const result = (await fetcher) as any as OpenAICompletionsResponse;

console.log({ result });

result.choices.forEach((choice) => {
  const { content } = choice.message;
  const parsedContent = JSON.parse(content);
  console.log({ parsedContent });
//   const validatedData = beGpt.validateApiData(
//     parsedContent,
//     fruitDataResponseSchema
//   );
//   console.log({ validatedData });
});

// const { validate, infer } = createValidator(fruitDataResponseSchema);

// type Fruit = typeof infer;

// const fruit: Fruit = {};

// Simple type validation schema
// const fruitSchema = {
//     name: "string",
//     calories: "number",
//     fatsGrams: "number",
//     proteinsGrams: "number",
//   } as const;

//   export type FruitType = InferType<SchemaType>;
//   type SchemaType = typeof fruitSchema;
