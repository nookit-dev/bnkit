import { VALID_HTML_TAGS } from "./constants";
import { CRNode } from "./htmlody-plugins";
import { Attributes, JsonHtmlNodeTree, JsonTagElNode } from "./htmlody-types";

export const retrieveElement = <Structure extends JsonHtmlNodeTree>(
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

export function formatAttributes(attributes: Attributes): string {
  return Object.entries(attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");
}

export function isValidHtmlTag(tagName: string): boolean {
  return VALID_HTML_TAGS.has(tagName);
}

export function isValidAttributesString(attributesStr: string): boolean {
  // Regex pattern for valid attribute format: key="value"
  const attributePattern = /^(\s?[a-zA-Z-]+="[^"]*"\s?)+$/;
  return attributePattern.test(attributesStr);
}

export function collectClassNames(
  node: JsonTagElNode,
  uniqueClassNames: Set<string>
) {
  if (node.attributes && typeof node.attributes.class === "string") {
    const classList = node.attributes.class.split(" ");
    classList.forEach((cls) => uniqueClassNames.add(cls));
  }
}
export const children = (children: JsonTagElNode<CRNode>[]) => {
  const returnChildren: JsonHtmlNodeTree = {};

  for (let i = 0; i < children.length; i++) {
    returnChildren[i] = children[i];
  }

  return returnChildren;
};
