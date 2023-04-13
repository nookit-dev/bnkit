import { describe, expect, test } from "bun:test";
import { parseHeaders, replaceMarkdown } from "../text-utils";

describe("replaceMarkdown function", () => {
  test("should replace all occurrences of ** with <strong> tags", () => {
    const result = replaceMarkdown(
      "This is **bold**",
      /\*\*(.+?)\*\*/g,
      "<strong>$1</strong>"
    );
    expect(result).toEqual("This is <strong>bold</strong>");
  });

  test("should replace all occurrences of * with <em> tags", () => {
    const result = replaceMarkdown(
      "This is *italicized*",
      /\*(.+?)\*/g,
      "<em>$1</em>"
    );
    expect(result).toEqual("This is <em>italicized</em>");
  });

  test("should replace all occurrences of [text](link) with <a href='link'>text</a> tags", () => {
    const result = replaceMarkdown(
      "Link: [Google](https://www.google.com)",
      /\[(.+?)\]\((.+?)\)/g,
      "<a href='$2'>$1</a>"
    );
    expect(result).toEqual("Link: <a href='https://www.google.com'>Google</a>");
  });

  test("should replace all occurrences of bullet points with <ul> and <li> tags", () => {
    const result = replaceMarkdown(
      "List:\n- Item 1\n- Item 2",
      /^-\s(.+)/gm,
      "<li>$1</li>"
    );
    expect(result).toEqual("List:\n<ul><li>Item 1</li><li>Item 2</li></ul>");
  });

  test("should replace all occurrences of numerical points with <ol> and <li> tags", () => {
    const result = replaceMarkdown(
      "List:\n1. Item 1\n2. Item 2",
      /^\d+\.\s(.+)/gm,
      "<li>$1</li>"
    );
    expect(result).toEqual("List:\n<ol><li>Item 1</li><li>Item 2</li></ol>");
  });
});

describe("parseHeaders function", () => {
  test("should parse h1 headers", () => {
    const result = parseHeaders("# Title");
    expect(result).toEqual("<h1>Title</h1>");
  });

  test("should parse h2 headers", () => {
    const result = parseHeaders("## Subtitle");
    expect(result).toEqual("<h2>Subtitle</h2>");
  });

  test("should parse h3 headers", () => {
    const result = parseHeaders("### Sub-subtitle");
    expect(result).toEqual("<h3>Sub-subtitle</h3>");
  });

  test("should parse multiple header levels", () => {
    const result = parseHeaders("# Title\n## Subtitle\n### Sub-subtitle");
    expect(result).toEqual(
      "<h1>Title</h1>\n<h2>Subtitle</h2>\n<h3>Sub-subtitle</h3>"
    );
  });
});
