import { createBeautifulGpt } from "./create-beautiful-gpt";
import { fetchChatCompletion } from "./fetch-chat-completion";

//updated completions response

const beGpt = createBeautifulGpt();

const fruitDataResponseSchema = {
  name: "string",
  calories: "number",
  fatsGrams: "number",
  proteinsGrams: "number",
} as const;

const result = await fetchChatCompletion(`
2 foods that are roughly 200 calories each
Return Data as JSON format, below is expected JSON format. The keys are the field names and the value is the expect type of that field::


{
  "name": "string",
  "calories": "number",
  "fatsGrams": "number",
  "proteinsGrams": "number"
}
`);

console.log({ result });

result.forEach((message) => {
  const { content } = message;
  const parsedContent = JSON.parse(content);
});
