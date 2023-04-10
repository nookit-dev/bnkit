import { createDebugPromptFromInputOutput } from "@/gpt-utils";
import { describe, expect, it } from "bun:test";
import { prettifyHTMLString } from "../index";

describe("formatHTML", () => {
  it("should properly format simple HTML", () => {
    const rawHTML = `<html><head><title>Sample HTML</title></head><body><h1>Hello World</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. <a href="https://example.com">Visit our website</a></p><ul><li>List Item 1</li><li>List Item 2</li><li>List Item 3</li></ul></body></html>`;

    const expectedFormattedHTML = `\
<html>
  <head>
    <title>Sample HTML</title>
  </head>
  <body>
    <h1>Hello World</h1>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. <a href="https://example.com">Visit our website</a>
    </p>
    <ul>
      <li>List Item 1</li>
      <li>List Item 2</li>
      <li>List Item 3</li>
    </ul>
  </body>
</html>`;

    createDebugPromptFromInputOutput(rawHTML, expectedFormattedHTML, {
      moduleName: "html-formatter.test.ts",
      functionName: "formatHTML",
    });

    console.log({ rawHTML });

    const formattedHTML = prettifyHTMLString(rawHTML);

    console.log({ formattedHTML });

    expect(formattedHTML).toBe(expectedFormattedHTML);
  });
});
