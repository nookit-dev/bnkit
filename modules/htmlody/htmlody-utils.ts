import { SELF_CLOSING_TAGS, VALID_HTML_TAGS } from "./constants";
import {
  Attributes,
  FullJsonHtmlDocStructure,
  JsonHtmlHead,
  JsonHtmlNodeMap,
  JsonTagElNode
} from "./html-type-engine";

export const retrieveElement = <Structure extends JsonHtmlNodeMap>(
  JsonHtmlNodeMap: Structure,
  element: keyof Structure
) => {
  return JsonHtmlNodeMap[element];
};

export const nodeFactory = <
  Extension extends Record<string, unknown>,
  NodeT extends JsonTagElNode = JsonTagElNode<Extension>,
  NodeConfigT extends NodeT = NodeT
>(
  config: NodeConfigT
) => {
  const createNode = (options?: Omit<NodeConfigT, "tag">): NodeT => {
    return {
      ...config,
      ...options,
    };
  };

  return {
    create: createNode,
  };
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

export function formatAttributes(attributes: Attributes): string {
  return Object.entries(attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");
}

function isValidHtmlTag(tagName: string): boolean {
  return VALID_HTML_TAGS.has(tagName);
}

function isValidAttributesString(attributesStr: string): boolean {
  // Regex pattern for valid attribute format: key="value"
  const attributePattern = /^(\s?[a-zA-Z-]+="[^"]*"\s?)+$/;
  return attributePattern.test(attributesStr);
}

export function renderHtmlTag(
  tagName: string,
  attributesStr: string,
  content: string,
  childrenHtml: string
): string {
  const space = attributesStr ? " " : "";

  // Check if the tag name is valid
  if (!isValidHtmlTag(tagName)) {
    throw new Error(`Invalid tag name provided: ${tagName}`);
  }

  if (attributesStr !== "" && !isValidAttributesString(attributesStr)) {
    throw new Error(`Invalid attributes string provided: ${attributesStr}`);
  }

  // Check if the tag is a self-closing tag using Set lookup
  if (SELF_CLOSING_TAGS.has(tagName)) {
    return `<${tagName}${space}${attributesStr} />`;
  }

  return `<${tagName}${space}${attributesStr}>${content}${childrenHtml}</${tagName}>`;
}
