import { SELF_CLOSING_TAGS } from "./constants";
import {
  ExtensionRec,
  JsonHtmlNodeMap,
  JsonTagElNode,
} from "./html-type-engine";
import { HTMLodyPlugin } from "./htmlody-plugins";
import {
  formatAttributes,
  isValidAttributesString,
  isValidHtmlTag,
} from "./htmlody-utils";

export function getValidatedTagName(tagName: string): string {
  if (!isValidHtmlTag(tagName)) {
    throw new Error(`Invalid tag name provided: ${tagName}`);
  }
  return tagName;
}

export function getValidatedAttributesStr(attributesStr: string): string {
  if (attributesStr !== "" && !isValidAttributesString(attributesStr)) {
    throw new Error(`Invalid attributes string provided: ${attributesStr}`);
  }
  return attributesStr;
}

export function getHtmlTags(
  tagName: string,
  attributesStr: string
): { startTag: string; closeTag: string } {
  const space = attributesStr ? " " : "";

  // Check if the tag is a self-closing tag using Set lookup
  if (SELF_CLOSING_TAGS.has(tagName)) {
    return {
      startTag: `<${tagName}${space}${attributesStr} />`,
      closeTag: "",
    };
  }

  return {
    startTag: `<${tagName}${space}${attributesStr}>`,
    closeTag: `</${tagName}>`,
  };
}

export function renderHtmlTag(
  tagName: string,
  attributesStr: string,
  content: string,
  childrenHtml: string
): string {
  const validatedTagName = getValidatedTagName(tagName);
  const validatedAttributesStr = getValidatedAttributesStr(attributesStr);
  const { startTag, closeTag } = getHtmlTags(
    validatedTagName,
    validatedAttributesStr
  );

  return `${startTag}${content}${childrenHtml}${closeTag}`;
}

export function renderChildrenNodes<Plugins extends HTMLodyPlugin<any>[]>(
  children: JsonHtmlNodeMap,
  plugins: Plugins
): string {
  return Object.entries(children)
    .map(([childTagName, childNode]) =>
      jsonToHtml({ [childTagName]: childNode }, plugins)
    )
    .join("");
}

function processNodeWithPlugins<
  Plugins extends HTMLodyPlugin<any>[],
  PluginProps extends ExtensionRec,
  Node extends JsonTagElNode<PluginProps> = JsonTagElNode<PluginProps>
>(node: Node, plugins: Plugins): Node {
  let processedNode = { ...node };
  for (const plugin of plugins) {
    processedNode = plugin.processNode(processedNode);
  }
  return processedNode;
}
export function renderNodeToHtml<
  Plugins extends HTMLodyPlugin<any>[],
  PluginProps extends ExtensionRec,
  Node extends JsonTagElNode<PluginProps> = JsonTagElNode<PluginProps>
>(node: Node, plugins: Plugins): string {
  node = processNodeWithPlugins(node, plugins);

  const idAttribute = node.attributes?.id ? `id="${node.attributes.id}"` : "";

  const tagName = node.tag;

  const content = node?.content || "";
  if (!tagName) {
    throw new Error(
      `Tag name not provided for node. 
      ${idAttribute ? `ID: ${idAttribute}` : ""}
      ${content ? `Content: ${content}` : ""}
      `
    );
  }

  const attributesStr = formatAttributes(node.attributes || {});
  const childrenHtml = node.children
    ? renderChildrenNodes(node.children, plugins)
    : "";

  return renderHtmlTag(tagName, attributesStr, content, childrenHtml);
}

export function jsonToHtml<
  Plugins extends HTMLodyPlugin<any>[],
  PluginProps extends ExtensionRec,
  Node extends JsonTagElNode<PluginProps> = JsonTagElNode<PluginProps>,
  NodeMap extends JsonHtmlNodeMap<Node> = JsonHtmlNodeMap<Node>
>(nodeMap: NodeMap, plugins: Plugins): string {
  return Object.keys(nodeMap)
    .map((id) => renderNodeToHtml(nodeMap[id], plugins))
    .join("");
}

export function renderNodeWithPlugins<
  Plugins extends HTMLodyPlugin<any>[],
  PluginProps extends ExtensionRec,
  Node extends JsonTagElNode<PluginProps> = JsonTagElNode<PluginProps>
>(node: Node, plugins: Plugins): string {
  node = processNodeWithPlugins(node, plugins);

  const tagName = node.tag;
  const content = node.content || "";
  if (!tagName) {
    const idAttribute = node.attributes?.id ? `id="${node.attributes.id}"` : "";
    throw new Error(
      `Tag name not provided for node. 
      ${idAttribute ? `ID: ${idAttribute}` : ""}
      ${content ? `Content: ${content}` : ""}
      `
    );
  }

  const attributesStr = formatAttributes(node.attributes || {});
  const childrenHtml = node.children
    ? renderChildrenNodes(node.children, plugins)
    : "";

  return renderHtmlTag(tagName, attributesStr, content, childrenHtml);
}

export type NodePluginsReturn<Plugins extends HTMLodyPlugin<any>[]> =
  ReturnType<Plugins[number]["processNode"]>;

export const createNodeFactory = <
  Plugins extends HTMLodyPlugin<any>[],
  PluginReturns extends NodePluginsReturn<Plugins>
>(
  plugins: Plugins
) => {
  const effectivePlugins = plugins;

  const createNode = (options?: PluginReturns) => {
    return {
      tag: "div",
      content: "",
      attributes: {},
      ...options,
    } as JsonTagElNode<PluginReturns>;
  };

  const renderHtml = (
    nodeMap: JsonHtmlNodeMap,
    pluginsOverride?: Plugins
  ): string => {
    const activePlugins = pluginsOverride || effectivePlugins;
    return Object.keys(nodeMap)
      .map((id) => renderNodeWithPlugins(nodeMap[id], activePlugins))
      .join("");
  };

  const renderSingleNode = (
    node: JsonTagElNode,
    pluginsOverride?: Plugins
  ): string => {
    const activePlugins = pluginsOverride || effectivePlugins;
    return renderNodeWithPlugins(node, activePlugins);
  };

  const renderChildren = (
    children: JsonHtmlNodeMap,
    pluginsOverride?: Plugins
  ): string => {
    const activePlugins = pluginsOverride || effectivePlugins;
    return Object.entries(children)
      .map(([childTagName, childNode]) =>
        renderNodeWithPlugins(childNode, activePlugins)
      )
      .join("");
  };

  return {
    createNode,
    renderHtml,
    renderSingleNode,
    renderChildren,
  };
};
