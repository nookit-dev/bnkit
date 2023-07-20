import { describe, expect, test } from "bun:test";
import { convertMarkdownToHTML, replaceMarkdown } from "./text-utils";

describe("HTML and Markdown utilities", () => {
  // Testing Markdown related functions
  describe("Markdown conversion", () => {
    // replaceMarkdown function
    test("replaceMarkdown replaces patterns correctly", () => {
      const markdown = "**Hello**";
      const regex = /\*\*(.+?)\*\*/g;
      const replacement = "<strong>$1</strong>";
      const expectedHTML = "<strong>Hello</strong>";
      expect(replaceMarkdown(markdown, regex, replacement)).toEqual(
        expectedHTML
      );
    });

    // parsers object
    test("convertMarkdownToHTML converts markdown to HTML", () => {
      const markdown =
        "# Hello\n**World**\n*This* is a [link](https://example.com)";
      const expectedHTML =
        '<h1>Hello</h1>\n<strong>World</strong>\n<em>This</em> is a <a href="https://example.com">link</a>';
      expect(convertMarkdownToHTML(markdown)).toEqual(expectedHTML);
    });

    // convertMarkdownToHTML function
    test("convertMarkdownToHTML converts markdown to HTML", () => {
      const markdown =
        "# Hello\n**World**\n*This* is a [link](https://example.com)";
      const expectedHTML =
        '<h1>Hello</h1>\n<strong>World</strong>\n<em>This</em> is a <a href="https://example.com">link</a>';
      expect(convertMarkdownToHTML(markdown)).toEqual(expectedHTML);
    });
  });
});
