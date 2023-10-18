import { expectType } from "tsd";
import { JsonHtmlNodeMap, RecursiveConstructHtmlTag } from "./html-type-engine";

type TSStringValidator<T, Expectation> = T extends Expectation ? true : false;
type IsNever<T> = [T] extends [never] ? true : false;
type IsValid<T, Expectation> = IsNever<T> extends true
  ? false
  : TSStringValidator<T, Expectation>;

export const htmlBody = {
  h1: {
    content: "Hello World",
    attributes: {
      class: "title-class",
      id: "title-id",
    },
  },
  p: {
    content: "This is a description",
  },
  a: {
    content: "Click Me",
    attributes: {
      href: "https://www.example.com",
    },
  },
  div: {
    children: {
      div: {
        children: {
          h1: {
            content: "H1 Hello world",
          },
          div: {
            content: "Hello World",
          },
        },
      },
    },
  },
} as const;

type ConvertedHtml = RecursiveConstructHtmlTag<typeof htmlBody>;

type H1 = ConvertedHtml["h1"];

// checks
type Results = {
  h1: IsValid<
    ConvertedHtml["h1"],
    '<h1 class="title-class" id="title-id">Hello World</h1>'
  >;
  p: IsValid<ConvertedHtml["p"], "<p>This is a description</p>">;
  a: IsValid<
    ConvertedHtml["a"],
    '<a href="https://www.example.com">Click Me</a>'
  >;
  div: IsValid<ConvertedHtml["div"], "<div><div>Hello World</div></div>">;
};

expectType<ConvertedHtml["h1"]>(
  '<h1 class="title-class" id="title-id">Hello World</h1>'
);
expectType<ConvertedHtml["p"]>("<p>This is a description</p>");
expectType<ConvertedHtml["a"]>(
  '<a href="https://www.example.com">Click Me</a>'
);
expectType<ConvertedHtml["div"]>("<div><div>Hello World</div></div>");

function convertNodeToHtml(node: JsonHtmlNodeMap): string {
  let result = "";
  for (const [tag, element] of Object.entries(node)) {
    const attributes = element.attributes
      ? " " +
        Object.entries(element.attributes)
          .sort(([a], [b]) => a.localeCompare(b)) // sort attributes
          .map(([k, v]) => `${k}="${v}"`)
          .join(" ")
      : "";
    if ("content" in element) {
      result += `<${tag}${attributes}>${element.content}</${tag}>`;
    } else {
      result += `<${tag}${attributes}>${convertNodeToHtml(
        element.children
      )}</${tag}>`;
    }
  }
  return result;
}

const html = convertNodeToHtml(htmlBody);
