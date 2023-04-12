export type DebugPromptOptions = {
  functionName?: string;
  moduleName?: string;
  additionalContentToAppend?: string;
};

export const createDebugPromptFromInputOutput = (
  input: string,
  output: string,
  options: DebugPromptOptions = {}
): string => {
  const {
    functionName,
    moduleName: fileName,
    additionalContentToAppend,
  } = options;

  let prompt = "I'm given:\n";
  prompt += `${input}\n\nOutput:\n${output}\n`;

  if (functionName) {
    prompt += `\nFunction name: ${functionName}\n`;
  }

  if (fileName) {
    prompt += `File name: ${fileName}\n`;
  }

  if (additionalContentToAppend) {
    prompt += `\nAdditional content:\n${additionalContentToAppend}\n`;
  }

  return prompt;
};
