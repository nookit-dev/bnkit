export type ActionConfig = {
  prompt: string;
  fileExtension: string;
  outputFolder?: string;
};

export type ActionsConfigKeys = keyof typeof chatGptActionsConfig;

export type ActionsConfig = {
  [key in ActionsConfigKeys]: ActionConfig;
};


export const chatGptActionsConfig = {
  clean: {
    prompt:
      "clean up this code? Please use TypeScript syntax, do not class based syntax, make sure it it readable and performant",
    fileExtension: "md",
  },
  readme: {
    prompt:
      "create a README.md file for this module? Please use markdown syntax and return the raw markdown string",
    fileExtension: "md",
  },
  comments: {
    prompt:
      "add comments to this code? Please use TypeScript syntax, do not class based syntax, make sure it it readable and performant",
    fileExtension: "md",
  },
  explain: {
    prompt: `explain this file? List other modules it depends on List the features of the module, and then give a brief technical description of the module. 
      "use markdown syntax and return the raw markdown string.`,
    fileExtension: "md",
  },
  examples: {
    prompt: `Can you give examples of how to use this module? Please use markdown syntax and return the raw markdown string.`,
    fileExtension: "md",
  },
  summarize: {
    prompt:
      "summarize the the most important features on this module? Include a list of all exports, return as raw markdown",
    fileExtension: "md",
  },
  unitTest: {
    prompt: `Based on the above module, write unit tests for it. Please use TypeScript syntax and return the raw string.`,
    fileExtension: "test.ts",
    outputFolder: "_docs"
  },
  improvements: {
    prompt:
      "list improvements that can be made to this module? Please use markdown syntax and return the raw markdown string.",
    fileExtension: "md",
  },
};

