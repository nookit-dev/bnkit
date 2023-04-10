# Introducing Beautiful-GPT

A TypeScript tool for developers to create type-safe interactions with OpenAI's Chat and Completion APIs and of course other GPT with similar interfaces/APIs.

### WARNING BASICALLY NOTHING IS WORKING YET

## Installation and Setup

1. Install dependencies: `bun install`
2. Run: `bun run index.ts`

This project is built with Bun v0.5.9, a fast and comprehensive JavaScript runtime.

## Overview

Beautiful-GPT enables developers to efficiently prototype and develop applications by generating precise API queries in a consumable format. Given that API calls can be costly, it is crucial to leverage caching where possible.

## Main Features

1. Customizable JSON response configuration.
2. Configurable type inferencing.
3. Error handling and retry limit settings(Eventually).
4. API call validation against the defined schema.

## Example Usage

1. Instantiate Beautiful-GPT with API token and JSON response format.

```
const beGpt = createBeautifulGpt({
  openaiToken: '',
  dataResponseFmt: 'json', // json will be default
})
```

2. Define expected JSON fields for the API response.

```
beGpt.createJsonFields(
 [
    { “foodName”: ‘string’ },
    { “calories”: ‘number’ },
    { “fats_grams”: 'number' },
    { “proteins_grams”: 'number' },
 ]
)
```

3. Create a prompt and generate a typed result.
   `beGpt.createPrompt(“give me 10 foods that are roughly 200 calories each”)`

4. Retrieve the raw prompt for API call.
   `const prompt = beGpt.getRawPrompt()`
5. Implement the API call using the raw prompt. Eventually I'll implement a version of this, but for now it's left up to the dev
   `const apiResult = await yourImplementationToMakeAPiCall(getRawPrompt)`

6. Validate the API data against the defined schema.
   `const validatedData = beGpt.validateApiData(apiResult.data)`

7. Error handling and optional retry adjustments.
   TBD...

## Roadmap

1. Build on top of the OpenAI package.
2. Develop an interface layer for seamless integration with direct HTTP connections to OpenAI.
3. Utilize Zod for response validation.
4. Design an API for GPT to generate an initial outline.

## Development and Release Process

Initially, the development and release process will be kept simple and manual. This includes keeping dependencies down, using built in bun features.

### TODO need to figure out how to release it on node as well

# Contributing

To install dependencies:

This project was created using `bun init` in bun v0.5.9. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

If you don't have bun please install it

After bun is installed run:

```bash
bun install
```

You can test the prompt generations by running

```bash
bun examples/chat-completions-fetch.ts`
```

If you want to run the prompts through an API like Open AIs you need to get your Open AI api key from the e Open AI developer dashboard

update the .env.example to .env and paste your API key where it says `OPENAI_API_KEY=`

then run

```bash
bun examples/chat-completions-fetch.ts
```

run a script in watch mode for example

```bash
bun run --watch examples/validator-sandbox.ts
```

link package to local project

Add this to you bun project dependecies
`"beautiful-gpt": "https://github.com/brandon-schabel/beautiful-gpt"`

and to Develop with it locally you can run the following command in in this directory

```bash
bun link
```

this will create a link this package which is `beautiful-gpt` that you can now use in your project
Next `cd` to your project

for example
`cd ../bun-playground`

and then run
`bun link beautiful-gpt`
