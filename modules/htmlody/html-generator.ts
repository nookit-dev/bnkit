import { htmlRes, serverFactory } from "../server";
import type {
    ConstructHtmlTag,
    FunctionMap,
    JsonHtmlHead,
    JsonHtmlNodeMap,
    RecursiveConstructHtmlTag,
} from "./html-type-engine";
import { buildPageConfig, jsonToHtml } from "./htmlody-utils";
import { htmlBody } from "./page-confg";

const tailwindConfig = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
};

// Define a function map for dynamic HTML generation
const functionMap = {
  generateTable: () => {
    return "<table><tr><td>Sample Table</td></tr></table>";
  },
} satisfies FunctionMap;

export const htmlFactory = <
  Head extends JsonHtmlHead,
  Body extends JsonHtmlNodeMap
>(
  headConfig: Head,
  bodyConfig: Body,
  {
    tailwindConfig,
    useHtmx,
    useTailwind,
    pageTitle,
  }: {
    useTailwind?: boolean;
    tailwindConfig?: object;
    useHtmx?: boolean;
    pageTitle?: string;
  }
) => {
  // Conditionally load Tailwind via CDN
  let tailwindScript = "";
  if (useTailwind) {
    // If a config is provided, this assumes that you have a CDN that can take it as a query parameter.
    // You'd need to adjust this if your CDN setup is different.
    const configParam = tailwindConfig;
    // ? `?config=${encodeURIComponent(tailwindConfig)}`
    // : "";

    // turn these into plugin params
    tailwindScript = `  <script src="https://cdn.tailwindcss.com"></script>`;
  }

  // Conditionally load htmx
  let htmxScript = "";
  if (useHtmx) {
    htmxScript = `<script src="https://unpkg.com/htmx.org"></script>`;
  }

  const infer = (): RecursiveConstructHtmlTag<Body> => {
    return {} as RecursiveConstructHtmlTag<Body>;
  };

  const bodyConfigToHtml = () => {
    return `
<body>
    ${jsonToHtml(bodyConfig)}
</body>`;
  };

  //   ${
  //     tailwindConfig
  //       ? `<script> tailwind.config = ${JSON.stringify(
  //           tailwindConfig,
  //           null,
  //           2
  //         )} </script>`
  //       : ""
  //   }

  const headConfigToHtml = () => {
    return `
<!doctype html>
<head>
    <title>${pageTitle}</title>
    ${tailwindScript}

    ${htmxScript}
</head>`;
  };

  const getHtmlOut = () => {
    return `
<html>
    ${headConfigToHtml()}
    ${bodyConfigToHtml()}
</html>
`;
  };

  return {
    getHtmlOut,
    infer,
    buildPageConfig: () => buildPageConfig(headConfig, bodyConfig),
  };
};

const example = {
  div: {
    content: "Hello World",
    attributes: {
      class: "title-class",
      id: "title-id",
    },
  },
} as const; //as const;

type Tester = ConstructHtmlTag<typeof example>;

export const pageFactory = htmlFactory({ title: "My Title" }, htmlBody, {
  pageTitle: "My Page",
  // tailwindConfig,
  useHtmx: true,
  useTailwind: true,
});

const server = serverFactory({
  serve: Bun.serve,
  routes: {
    "/": {
      GET: (req, res) => {
        return htmlRes(pageFactory.getHtmlOut());
      },
    },
  },
});

server.start();
