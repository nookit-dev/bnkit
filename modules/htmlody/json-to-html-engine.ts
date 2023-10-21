import {
  ExtensionRec,
  JsonHtmlNodeMap,
  JsonTagElNode,
} from "./html-type-engine";
import { HTMLodyPlugin } from "./htmlody-plugins";
import { formatAttributes, renderHtmlTag } from "./htmlody-utils";

export function renderChildren<Plugins extends HTMLodyPlugin<any>[]>(
  children: JsonHtmlNodeMap,
  plugins?: Plugins
): string {
  return Object.entries(children)
    .map(([childTagName, childNode]) =>
      jsonToHtml({ [childTagName]: childNode }, plugins)
    )
    .join("");
}
export function jsonToHtml<
  Plugins extends HTMLodyPlugin<any>[],
  PluginProps extends ExtensionRec,
  Node extends JsonTagElNode<PluginProps> = JsonTagElNode<PluginProps>,
  NodeMap extends JsonHtmlNodeMap<Node> = JsonHtmlNodeMap<Node>
>(nodeMap: NodeMap, plugins?: Plugins): string {
  return Object.keys(nodeMap)
    .map((id) => {
      let node = nodeMap[id];
      if (plugins) {
        for (const plugin of plugins) {
          node = plugin.processNode(node);
        }
      }
      const tagName = node.tag;
      if (!tagName) {
        throw new Error(`Tag name not provided for ID: ${id}`);
      }

      const content = node.content || "";
      const attributesStr = formatAttributes(node.attributes || {});
      const childrenHtml = node.children
        ? renderChildren(node.children, plugins)
        : "";

      return renderHtmlTag(tagName, attributesStr, content, childrenHtml);
    })
    .join("");
}
