import { JsonTagElNode } from ".";
// import { pageFactory } from "./html-generator";

export const htmxButton: JsonTagElNode = {
  content: "Click Me",
  attributes: {
    "hx-post": "/clicked",
    "hx-trigger": "click",
    "hx-target": "#clicked",
    "hx-swap": "outerHTML",
  },
  tag: "button",
};

export const htmlBody = {
  h1: {
    content: "Hello World",
    attributes: {
      class: "title-class",
      id: "title-id",
    },

    tag: "h1",
  },
  p: { content: "This is a description", tag: "p" },
  a: {
    content: "Click Me",
    attributes: {
      href: "https://www.example.com",
    },
    tag: "a",
  },

  div_1: {
    tag: "div",
    attributes: {
      class: "bg-red-500",
    },
    children: {
      button_1: htmxButton,
      div_1: {
        tag: "div",
        content: "Hello World",
      },
    },
  },
} // satisfies JsonHtmlNodeMap;

// type HtmlTypeRes = ReturnType<typeof pageFactory.infer>;
