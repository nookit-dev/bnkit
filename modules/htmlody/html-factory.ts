import { cc, generateCSS, generateColorVariables } from "./css-engine";
import type {
  ConstructHtmlTag,
  FunctionMap,
  JsonHtmlHead,
  JsonHtmlNodeMap,
  RecursiveConstructHtmlTag,
} from "./html-type-engine";
import { CRNode, classRecordPlugin } from "./htmlody-plugins";
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
  Body extends JsonHtmlNodeMap<CRNode>
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

  const bodyConfigToHtml = ({ children }: { children?: string } = {}) => {
    return `
<body>
    ${jsonToHtml(bodyConfig, [classRecordPlugin])}
    ${children}
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


    <link rel="stylesheet" href="./assets/normalizer.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
</head>`;
  };

  const getHtmlOut = () => {
    return `
<html>
    ${headConfigToHtml()}

    ${bodyConfigToHtml({
      children: `<style>${generateColorVariables()}</style>\n
<style>${generateCSS(bodyConfig)}</style>
`,
    })}
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

const example: CRNode = {
  tag: "div",
  content: "Hello World",
  cr: cc(["bg-blue-500"]),
  attributes: {
    id: "title-id",
  },
};

type Tester = ConstructHtmlTag<typeof example>;
