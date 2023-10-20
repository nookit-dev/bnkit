import type {
  ConstructHtmlTag,
  FunctionMap,
  JsonHtmlHead,
  JsonHtmlNodeMap,
  RecursiveConstructHtmlTag,
} from "./html-type-engine";
import { buildPageConfig } from "./htmlody-utils";
import { jsonToHtml } from "./json-to-html-engine";

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
  }: {
    useTailwind?: boolean | string;
    tailwindConfig?: object;
    useHtmx?: boolean | string;
    pageTitle?: string;
  }
) => {
  // Conditionally load Tailwind via CDN
  let tailwindScript = "";
  if (useTailwind) {
    // If a config is provided, this assumes that you have a CDN that can take it as a query parameter.
    // You'd need to adjust this if your CDN setup is different.
    const configParam = tailwindConfig;
    if (useTailwind === true) {
      // TODO turn these into plugin params
      tailwindScript = `<script src="https://cdn.tailwindcss.com"></script>`;
    } else if (typeof useTailwind === "string") {
      tailwindScript = `<script src="${useTailwind}"></script>`;
    }
  }

  // Conditionally load htmx
  let htmxScript = "";

  if (useHtmx === true) {
    htmxScript = `<script src="https://unpkg.com/htmx.org"></script>`;
    // optionally pass in path to htmx file
  } else if (typeof useHtmx === "string") {
    htmxScript = `<script src="${useHtmx}"></script>`;
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
    <title>${headConfig.title}</title>
</head>`;
  };

  const getHtmlOut = () => {
    return `
<html>
    ${headConfigToHtml()}
    ${bodyConfigToHtml()}
    ${tailwindScript}

    ${htmxScript}
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
