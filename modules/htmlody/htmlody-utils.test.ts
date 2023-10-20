import { describe, expect, it } from "bun:test";
import { Attributes, JsonHtmlNodeMap, JsonTagElNode } from "./html-type-engine";
import {
  formatAttributes,
  nodeFactory,
  retrieveElement,
} from "./htmlody-utils";
import { jsonToHtml, renderChildren } from "./json-to-html-engine";

describe("formatAttributes", () => {
  it("should handle empty attributes", () => {
    const attributes: Attributes = {};
    const formatted = formatAttributes(attributes, {});
    expect(formatted).toBe("");
  });
});

describe("formatAttributes", () => {
  it("should format attributes into string", () => {
    const attributes: Attributes = {
      id: `id-${Math.floor(Math.random() * 1000)}`,
      class: "sample-class",
    };
    const formatted = formatAttributes(attributes, {});
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
    const rendered = renderChildren(children, []);
    expect(rendered).toContain(children.div_id.content);
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

    const rendered = jsonToHtml(nodeMap, []);
    expect(rendered).toContain(nodeMap.div_id1.content);
    expect(rendered).toContain(nodeMap.div_id1.attributes!.id);
    expect(rendered).toContain(nodeMap.div_id1.attributes!.class);
    expect(rendered).toContain(nodeMap.div_id1.children!.span_id1.content);
  });
});

describe("retrieveElement", () => {
  it("should retrieve an element from a JsonHtmlNodeMap", () => {
    const JsonHtmlNodeMap = {
      div: {
        tag: "div",
        attributes: {
          class: "sample-class",
        },
        content: "Sample Content",
      },
    };
    const element = retrieveElement(JsonHtmlNodeMap, "div");
    expect(element).toEqual({
      tag: "div",
      attributes: {
        class: "sample-class",
      },
      content: "Sample Content",
    });
  });

  it("should return undefined if the element is not present in the JsonHtmlNodeMap", () => {
    const JsonHtmlNodeMap = {
      div: {
        tag: "div",
        attributes: {
          class: "sample-class",
        },
        content: "Sample Content",
      },
    };
    const element = retrieveElement(JsonHtmlNodeMap, "span");
    expect(element).toBeUndefined();
  });
});

describe("nodeFactory", () => {
  it("should create a new node with the given configuration", () => {
    const nodeConfig = {
      tag: "div",
      attributes: {
        class: "sample-class",
        id: "sample-id",
      },
      content: "Sample Content",
    };
    const factory = nodeFactory(nodeConfig);
    const newNode = factory.create();
    expect(newNode).toEqual({
      tag: "div",
      attributes: {
        class: "sample-class",
        id: "sample-id",
      },
      content: "Sample Content",
    });
  });
});
