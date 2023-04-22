describe("createDebugPromptFromInputOutput", () => {
  it("should return a prompt with input and output", () => {
    const input = "3";
    const output = "9";
    const expectedPrompt = "I'm given:\n3\n\nOutput:\n9\n";

    const prompt = createDebugPromptFromInputOutput(input, output);

    expect(prompt).toEqual(expectedPrompt);
  });

  it("should include function name in prompt if provided", () => {
    const input = "hello";
    const output = "olleh";
    const functionName = "reverseString";
    const expectedPrompt = `I'm given:\nhello\n\nOutput:\nolleh\n\nFunction name: ${functionName}\n`;

    const prompt = createDebugPromptFromInputOutput(input, output, { functionName });

    expect(prompt).toEqual(expectedPrompt);
  });

  it("should include module name in prompt if provided", () => {
    const input = "4";
    const output = "true";
    const moduleName = "isPositive";
    const expectedPrompt = `I'm given:\n4\n\nOutput:\ntrue\nFile name: ${moduleName}\n`;

    const prompt = createDebugPromptFromInputOutput(input, output, { moduleName });

    expect(prompt).toEqual(expectedPrompt);
  });

  it("should include additional content in prompt if provided", () => {
    const input = "hello";
    const output = "ello";
    const additionalContentToAppend = "Expected output should start with the second letter";
    const expectedPrompt = `I'm given:\nhello\n\nOutput:\nello\n\nAdditional content:\n${additionalContentToAppend}\n`;

    const prompt = createDebugPromptFromInputOutput(input, output, { additionalContentToAppend });

    expect(prompt).toEqual(expectedPrompt);
  });

  it("should return an empty prompt if input and output are empty", () => {
    const input = "";
    const output = "";
    const expectedPrompt = "I'm given:\n\n\nOutput:\n\n";

    const prompt = createDebugPromptFromInputOutput(input, output);

    expect(prompt).toEqual(expectedPrompt);
  });
});