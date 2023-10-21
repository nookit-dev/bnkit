import { describe, expect, it } from "bun:test";
import { JsonHtmlNodeMap, JsonTagElNode } from ".";
import { generateCSS } from "./generate-css"; // Update this import path
import { nodeFactory } from "./htmlody-utils";
import { ClassRecordAttributes } from "./htmlody-plugins";

const createNode = nodeFactory({
  tag: "div",
}).create();

describe("generateCSS", () => {
  it("should generate correct CSS from nodeMap", () => {
    const mockNodeMap: JsonHtmlNodeMap<JsonTagElNode<ClassRecordAttributes>> = {
      exampleDiv: {
        tag: "div",
        cr: {
          "flex m-1": true,
          grid: false,
          "w-1/2": true,
        },
      },
      exampleSpan: {
        tag: "span",
        cr: {
          "h-1/2 p-1": true,
          flex: false,
        },
      },
    };

    const result = generateCSS(mockNodeMap);
    const expectedCss =
      `.flex { display: flex; }\n` +
      `.m-1 { margin: 0.25rem; }\n` +
      `.w-1/2 { width: 50%; }\n` +
      `.h-1/2 { height: 50%; }\n` +
      `.p-1 { padding: 0.25rem; }\n`;

    expect(result).toEqual(expectedCss);
  });
  it("should return empty string for empty nodeMap", () => {
    const mockNodeMap: JsonHtmlNodeMap<JsonTagElNode<ClassRecordAttributes>> = {};

    const result = generateCSS(mockNodeMap);
    expect(result).toEqual("");
  });

  it("should handle nodes without the cr property", () => {
    const mockNodeMap: JsonHtmlNodeMap<JsonTagElNode<ClassRecordAttributes>> = {
      exampleDiv: {
        tag: "div",
      },
    };

    const result = generateCSS(mockNodeMap);
    expect(result).toEqual("");
  });

  it("should ignore invalid class names", () => {
    const mockNodeMap: JsonHtmlNodeMap<JsonTagElNode<ClassRecordAttributes>> = {
      exampleDiv: {
        tag: "div",
        cr: {
          "invalid-class": true,
        },
      },
    };

    const result = generateCSS(mockNodeMap);
    expect(result).toEqual(""); // No CSS generated for invalid class names
  });

  it("should not generate CSS if all classes are set to false", () => {
    const mockNodeMap: JsonHtmlNodeMap<JsonTagElNode<ClassRecordAttributes>> = {
      exampleDiv: {
        tag: "div",
        cr: {
          flex: false,
          "m-1": false,
        },
      },
    };

    const result = generateCSS(mockNodeMap);
    expect(result).toEqual(""); // No CSS generated
  });
});
