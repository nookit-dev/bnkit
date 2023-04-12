import createOpenAICompletions from "../openai-completions";

const API_KEY = Bun.env.NODE_ENV

const openAICompletions =  createOpenAICompletions({apiKey: API_KEY});




// ask user for a web link and set the input to a variable
const input = await Bun.prompt("Enter a web link: ");

openAICompletions.getCompletions({
    prompt: ""
})
