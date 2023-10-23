import { expectType } from "tsd";
import { RecursiveConstructHtmlTag } from "./html-type-engine";
import { htmxButton } from "./page-confg";

type TSStringValidator<T, Expectation> = T extends Expectation ? true : false;
type IsNever<T> = [T] extends [never] ? true : false;
type IsValid<T, Expectation> = IsNever<T> extends true
  ? false
  : TSStringValidator<T, Expectation>;

export const htmlBody = {
  h1id: {
    tag: "h1",
    content: "Hello World",
    attributes: {
      class: "bg-blue-500",
      id: "title-id",
    },
  },
  pid: {
    tag: "p",
    content: "This is a description",
  },
  aid: {
    tag: "a",
    content: "Click Me",
    attributes: {
      href: "https://www.example.com",
    },
  },
  div1id: {
    tag: "div",
    children: {
      div2id: {
        tag: "div",
        children: {
          div3id: {
            tag: "div",
            content: "Hello World",
          },
        },
      },
    },
  },
  red_div: {
    tag: "div",
    attributes: {
      class: "bg-red-500",
    },
  },
  htmxButton,
} as const;

type ConvertedHtml = RecursiveConstructHtmlTag<typeof htmlBody>;

type H1 = ConvertedHtml["h1id"];

// checks
type Results = {
  h1: IsValid<
    ConvertedHtml["h1id"],
    '<h1 class="bg-blue-500" id="title-id">Hello World</h1>'
  >;
  p: IsValid<ConvertedHtml["pid"], "<p>This is a description</p>">;
  a: IsValid<
    ConvertedHtml["aid"],
    '<a href="https://www.example.com">Click Me</a>'
  >;
  div: IsValid<ConvertedHtml["div1id"], "<div><div>Hello World</div></div>">;
};

expectType<ConvertedHtml["h1id"]>(
  '<h1 class="bg-blue-500" id="title-id">Hello World</h1>'
);
expectType<ConvertedHtml["pid"]>("<p>This is a description</p>");
expectType<ConvertedHtml["aid"]>(
  '<a href="https://www.example.com">Click Me</a>'
);
expectType<ConvertedHtml["div1id"]>("<div><div>Hello World</div></div>");
