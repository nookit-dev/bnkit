import { describe, expect, it } from "bun:test";
import { ClassRecordAttributes, classRecordPlugin, classRecordPluginHandler } from "./htmlody-plugins";
import { JsonHtmlNodeMap, JsonTagElNode, jsonToHtml } from ".";

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
