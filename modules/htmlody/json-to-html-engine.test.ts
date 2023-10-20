import { describe, expect, it } from "bun:test";
import { JsonHtmlNodeMap } from "./html-type-engine";
import { randomAttributes } from "./htmlody-test-utils";
import { renderHtmlTag } from "./htmlody-utils";
import { jsonToHtml } from "./json-to-html-engine";

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
  describe("renderHtmlTag", () => {
    it("should throw error for invalid tags", () => {
      let errorOccurred = false;
      try {
        renderHtmlTag("invalidTag", "", "", "");
      } catch (e) {
        errorOccurred = true;
        // @ts-expect-error
        expect(e.message).toBe("Invalid tag name provided: invalidTag"); // If you want to check the error message
      }
      expect(errorOccurred).toBe(true);
    });
  });
  it("should handle missing content and children", () => {
    const nodeMap: JsonHtmlNodeMap = {
      div_id1: {
        tag: "div",
        attributes: randomAttributes(),
      },
    };
    const rendered = jsonToHtml(nodeMap, []);
    expect(rendered).not.toContain("undefined");
  });
});

describe("jsonToHtml", () => {
  it("should apply plugins to nodes", () => {
    const nodeMap = {
      div: {
        tag: "div",
        cr: {
          "sample-class": true,
        },
        content: "Sample Content",
      },
    };
    const plugins = [
      {
        processNode: (node) => {
          if (node.cr) {
            node.attributes = {
              ...node.attributes,
              class: Object.keys(node.cr)
                .filter((key) => node.cr[key])
                .join(" "),
            };
          }
          return node;
        },
      },
    ];
    const html = jsonToHtml(nodeMap, plugins);
    expect(html).toBe('<div class="sample-class">Sample Content</div>');
  });

  it("should throw an error if tag name is not provided", () => {
    const nodeMap = {
      div: {
        attributes: {
          class: "sample-class",
        },
        content: "Sample Content",
      },
    };
    const plugins = [];
    expect(() => jsonToHtml(nodeMap, plugins)).toThrow(
      "Tag name not provided for ID: div"
    );
  });
});
