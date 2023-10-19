import { describe, expect, it } from "bun:test";
import { Attributes, JsonHtmlNodeMap, JsonTagElNode } from "./html-type-engine";
import {
    extractTagName,
    formatAttributes,
    jsonToHtml,
    renderChildren,
    renderHtmlTag,
} from "./htmlody-utils";
describe("extractTagName", () => {
  it("should extract the tag from the node", () => {
    const randomTagName = `tag${Math.floor(Math.random() * 1000)}`;
    const node: JsonTagElNode = {
      tag: randomTagName,
    };
    expect(extractTagName(node)).toBe(randomTagName);
  });
});

describe("formatAttributes", () => {
  it("should format attributes into string", () => {
    const attributes: Attributes = {
      id: `id-${Math.floor(Math.random() * 1000)}`,
      class: "sample-class",
    };
    const formatted = formatAttributes(attributes);
    expect(formatted).toContain(attributes.id);
    expect(formatted).toContain(attributes.class);
  });
});

describe("renderChildren", () => {
  it("should render children recursively", () => {
    const children: JsonHtmlNodeMap = {
      div_id: {
        tag: "div",
        content: `content-${Math.floor(Math.random() * 1000)}`,
      },
    };
    const rendered = renderChildren(children);
    expect(rendered).toContain(children.div_id.content);
  });
});

describe("renderHtmlTag", () => {
  it("should render HTML tag with attributes and content", () => {
    const tagName = "div";
    const attributesStr = 'class="sample"';
    const content = "Hello World";
    const childrenHtml = "<span>Child</span>";

    const rendered = renderHtmlTag(
      tagName,
      attributesStr,
      content,
      childrenHtml
    );
    expect(rendered).toContain(tagName);
    expect(rendered).toContain(attributesStr);
    expect(rendered).toContain(content);
    expect(rendered).toContain(childrenHtml);
  });
});

describe("jsonToHtml", () => {
  it("should render entire HTML structure from node map", () => {
    const nodeMap: JsonHtmlNodeMap = {
      div_id1: {
        tag: "div",
        content: "Sample Content",
        attributes: {
          id: "sample-id",
          class: "sample-class",
        },
        children: {
          span_id1: {
            tag: "span",
            content: "Child Content",
          },
        },
      },
    };

    const rendered = jsonToHtml(nodeMap);
    expect(rendered).toContain(nodeMap.div_id1.content);
    expect(rendered).toContain(nodeMap.div_id1.attributes!.id);
    expect(rendered).toContain(nodeMap.div_id1.attributes!.class);
    expect(rendered).toContain(nodeMap.div_id1.children!.span_id1.content);
  });
});