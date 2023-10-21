import { describe, expect, it } from "bun:test";
import { JsonHtmlNodeMap, JsonTagElNode, jsonToHtml } from ".";
import {
  ClassRecordAttributes,
  classRecordPlugin,
  classRecordPluginHandler,
  markdownPlugin
} from "./htmlody-plugins";

describe("classRecordPluginHandler", () => {
  it("should add classes to attributes based on ClassRecord", () => {
    const node = {
      tag: "div",
      cr: {
        "class-1": true,
        "class-2": false,
        "class-3": true,
      },
      attributes: {
        id: "sample-id",
      },
      content: "Sample Content",
    };
    const processedNode = classRecordPluginHandler(node);
    // @ts-expect-error
    expect(processedNode.attributes?.class).toBe("class-1 class-3");
  });

  it("should not add classes to attributes if ClassRecord is not present", () => {
    const node = {
      tag: "div",
      attributes: {
        id: "sample-id",
      },
      content: "Sample Content",
    };
    const processedNode = classRecordPluginHandler(node);
    // @ts-expect-error
    expect(processedNode.attributes?.class).toBeUndefined();
  });
});

describe("classRecordPlugin", () => {
  const sampleNodeMap: JsonHtmlNodeMap<JsonTagElNode & ClassRecordAttributes> =
    {
      div1: {
        tag: "div",
        cr: {
          "class-one": true,
          "class-two": false,
          "class-three": true,
        },
        content: "Hello World!",
      },
      div2: {
        tag: "div",
        cr: {
          "class-four": true,
        },
        content: "Another div",
      },
    };

  it("should add classes based on the ClassRecord", () => {
    const renderedHtml = jsonToHtml(sampleNodeMap, [classRecordPlugin]);
    expect(renderedHtml).toContain(
      '<div class="class-one class-three">Hello World!</div>'
    );
    expect(renderedHtml).toContain('<div class="class-four">Another div</div>');
  });

  it("should not add classes with a value of false", () => {
    const renderedHtml = jsonToHtml(sampleNodeMap, [classRecordPlugin]);
    expect(renderedHtml).not.toContain("class-two");
  });
});

describe("Markdown Plugin with jsonToHtml", () => {
  it("should convert a simple markdown text to HTML", () => {
    const input = {
      sampleId: {
        tag: "div",
        markdown: "# Hello\nThis is **bold**.",
      },
    };

    const output = jsonToHtml(input, [markdownPlugin]);

    const expectedOutput = `<div><h1>Hello</h1>\n<p>This is <strong>bold</strong>.</p></div>`;
    expect(output).toBe(expectedOutput);
  });

  it("should handle nodes without markdown", () => {
    const input = {
      sampleId: {
        tag: "div",
        content: "Just a regular div.",
      },
    };

    const output = jsonToHtml(input, [markdownPlugin]);

    const expectedOutput = `<div>Just a regular div.</div>`;
    expect(output).toBe(expectedOutput);
  });
});
