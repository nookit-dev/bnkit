import { htmlFactory, pageFactory } from "./html-generator";

export const htmlBody = {
  h1: {
    content: "Hello World",
    attributes: {
      class: "title-class",
      id: "title-id",
    },
  },
  p: { content: "This is a description" },
  a: {
    content: "Click Me",
    attributes: {
      href: "https://www.example.com",
    },
  },

  div: {
    attributes: {
      class: "bg-red-500",
    },
    children: {
      button: {
        content: "Click Me",
        attributes: {
          "hx-post": "/clicked",
          "hx-trigger": "click",
          "hx-target": "#clicked",
          "hx-swap": "outerHTML",
        },
      },
      div: {
        content: "Hello World",
      },
    },
  },
} as const; // satisfies JsonHtmlNodeMap;


type HtmlTypeRes = ReturnType<typeof pageFactory.infer>;
