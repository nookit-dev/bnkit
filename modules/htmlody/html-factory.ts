import { cc, generateCSS, generateColorVariables } from "./css-engine";
import type {
  FunctionMap,
  JsonHtmlHead,
  JsonHtmlNodeMap,
} from "./html-type-engine";
import { CRNode, classRecordPlugin } from "./htmlody-plugins";
import { jsonToHtml } from "./json-to-html-engine";

const functionMap = {
  generateTable: () => {
    return "<table><tr><td>Sample Table</td></tr></table>";
  },
} satisfies FunctionMap;

export const pageGenerator = <Head extends JsonHtmlHead>(
  headConfig: Head,
  {
    useHtmx,
  }: {
    useHtmx?: boolean | string;
  } = {}
) => {
  let htmxScript = "";

  if (useHtmx === true) {
    htmxScript = `<script src="https://unpkg.com/htmx.org"></script>`;
  } else if (typeof useHtmx === "string") {
    htmxScript = `<script src="${useHtmx}"></script>`;
  }

  // const infer = (): RecursiveConstructHtmlTag<Body> => {
  //   return {} as RecursiveConstructHtmlTag<Body>;
  // };

  const headConfigToHtml = () => {
    return `
    <title>${headConfig.title}</title>


    <link rel="stylesheet" href="./assets/normalizer.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
`;
  };

  // TODO add second optional to configure, head title and thigns like that

  const buildHtml = (config: JsonHtmlNodeMap<CRNode>) => {
    return /* html */ `
<!doctype html>
<html>
  <head>

    ${headConfigToHtml()}

  </head>
  <body>
    ${jsonToHtml(config, [classRecordPlugin])}
    <style>${generateColorVariables()}</style>
    <style>${generateCSS(config)}</style>
    ${htmxScript}
  </body>
</html>
`;
  };

  const response = (config: JsonHtmlNodeMap<CRNode>) => {
    return new Response(buildHtml(config), {
      headers: {
        "Content-Type": "text/html",
      },
    });
  };

  return {
    buildHtml,
    response,
  };
};
