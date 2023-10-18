import {
    Attributes,
    FullJsonHtmlDocStructure,
    JsonHtmlHead,
    JsonHtmlNodeMap,
} from "./html-type-engine";

const retrieveElement = <Structure extends JsonHtmlNodeMap>(
  JsonHtmlNodeMap: Structure,
  element: keyof Structure
) => {
  return JsonHtmlNodeMap[element];
};

export const buildPageConfig = <
  Head extends JsonHtmlHead,
  Body extends JsonHtmlNodeMap
>(
  head: Head,
  body: Body
): FullJsonHtmlDocStructure<Head, Body> => {
  return {
    html: {
      head,
      body,
    },
  };
};

// Utility to extract tag name from the node map
export function extractTagName(nodeMap: JsonHtmlNodeMap): string {
  return Object.keys(nodeMap)[0];
}

export function formatAttributes(attributes: Attributes): string {
  return Object.entries(attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");
}

export function renderChildren(children: JsonHtmlNodeMap): string {
  return Object.entries(children)
    .map(([childTagName, childNode]) =>
      jsonToHtml({ [childTagName]: childNode })
    )
    .join("");
}

export function renderHtmlTag(
  tagName: string,
  attributesStr: string,
  content: string,
  childrenHtml: string
): string {
  return `<${tagName} ${attributesStr}>${content}${childrenHtml}</${tagName}>`;
}

export function jsonToHtml(nodeMap: JsonHtmlNodeMap): string {
  const tagName = extractTagName(nodeMap);
  const node = nodeMap[tagName];
  const content = node.content || "";
  const attributesStr = formatAttributes(node.attributes || {});
  const childrenHtml = renderChildren(node.children || {});

  return renderHtmlTag(tagName, attributesStr, content, childrenHtml);
}
