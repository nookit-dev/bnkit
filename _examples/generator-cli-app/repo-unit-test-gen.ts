import { cliApp } from "./generator-cli-app";

export type ActionConfig = {
  prompt: string;
  fileExtension: string;
  outputFolder?: string;
};

export type ActionsConfigKeys = keyof typeof unitTestActionsConfig;

export type ActionsConfig = {
  [key in ActionsConfigKeys]: ActionConfig;
};

export const unitTestActionsConfig = {
  "unit-test": {
    prompt:
      "generate a unit tests for this module? Please make sure it tests all functions, edge cases and returns the expected results",
    fileExtension: "test.ts",
    outputFolder: "_tests",
  },
  "test-coverage": {
    prompt:
      "generate a test coverage report for this module? Please use a coverage library of your choice and make sure it covers all functions and edge cases",
    fileExtension: "md",
    outputFolder: "_tests",
  },
};

await cliApp(unitTestActionsConfig);
