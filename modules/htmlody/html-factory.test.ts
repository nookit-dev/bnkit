import { describe, expect, it } from "bun:test";
import { CRNode } from ".";
import { cc } from "./css-engine";
import { pageGenerator } from "./html-factory";
import type { JsonHtmlNodeMap } from "./html-type-engine";
import { htmlBody } from "./html-type-engine.test";

describe("htmlFactory", () => {
  const mockHeadConfig = { title: "Test Title" };
  const mockBodyConfig: JsonHtmlNodeMap<CRNode> = {
    divId: {
      tag: "div",
      content: "Test Content",
      cr: cc(["bg-blue-500"]),
      children: {
        spanId: {
          tag: "span",
          content: "Child Content",
        },
      },
    },
  };

  it("renders basic elements correctly", () => {
    const factory = pageGenerator(mockHeadConfig);
    const htmlOut = factory.buildHtml(mockBodyConfig);

    expect(htmlOut).toContain('<div class="bg-blue-500">');
    expect(htmlOut).toContain("Test Content");
    expect(htmlOut).toContain("</div>");
  });

  it("renders attributes correctly", () => {
    const factory = pageGenerator(mockHeadConfig);
    const htmlOut = factory.buildHtml(mockBodyConfig);

    expect(htmlOut).toContain('class="bg-blue-500"');
  });

  it("renders nested children correctly", () => {
    const factory = pageGenerator(mockHeadConfig);
    const htmlOut = factory.buildHtml(mockBodyConfig);

    expect(htmlOut).toContain("<span>");
    expect(htmlOut).toContain("Child Content");
    expect(htmlOut).toContain("</span>");
  });

  it("handles optional configurations correctly", () => {
    const factory = pageGenerator(mockHeadConfig, {
      useHtmx: true,
    });
    const htmlOut = factory.buildHtml(mockBodyConfig);

    expect(htmlOut).toContain(
      '<script src="https://unpkg.com/htmx.org"></script>'
    );
  });
});

const createPageFactory = () => {
  return pageGenerator(
    { title: "My Title" },
    {
      useHtmx: true,
    }
  );
};

describe("htmlFactory", () => {
  it("renders complete HTML structure based on provided config", () => {
    const factory = createPageFactory();
    const htmlOut = factory.buildHtml(htmlBody);

    expect(htmlOut).toContain(
      '<h1 class="bg-blue-500" id="title-id">Hello World</h1>'
    );
    expect(htmlOut).toContain("<p>This is a description</p>");
    expect(htmlOut).toContain('<a href="https://www.example.com">Click Me</a>');
    expect(htmlOut).toContain('<div class="bg-red-500">');
    expect(htmlOut).toContain(
      '<button hx-post="/clicked" hx-trigger="click" hx-target="#clicked" hx-swap="outerHTML">Click Me</button>'
    );
    expect(htmlOut).toContain("<div>Hello World</div>");
  });

  it("includes optional configurations like Tailwind and htmx", () => {
    const factory = createPageFactory();
    const htmlOut = factory.buildHtml(htmlBody);

    expect(htmlOut).toContain(
      '<script src="https://unpkg.com/htmx.org"></script>'
    );
  });
});
