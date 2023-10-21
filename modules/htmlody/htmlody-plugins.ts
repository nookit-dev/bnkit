import { convertMarkdownToHTML } from "mod/utils/text-utils";
import { ClassRecord, JsonTagElNode } from "./html-type-engine";


// this will be the node that will be attached to our json node
export type ClassRecordAttributes = {
  cr?: ClassRecord;
};

export interface HTMLodyPlugin<T extends object = {}> {
  processNode: (node: JsonTagElNode & T) => JsonTagElNode & T;
}

export const classRecordPluginHandler = <
  Node extends JsonTagElNode & ClassRecordAttributes
>(
  node: Node
) => {
  let classes = "";
  if (node.cr) {
    classes = Object.entries(node.cr)
      .filter(([, value]) => value)
      .map(([key]) => key)
      .join(" ");
    return {
      ...node,
      attributes: { ...node.attributes, class: classes },
    };
  }
  return node;
};

export const classRecordPlugin: HTMLodyPlugin<ClassRecordAttributes> = {
  processNode: classRecordPluginHandler,
};

export type MarkdownAttributes = {
  markdown?: string;
};

export const markdownPluginHandler = <
  Node extends JsonTagElNode & MarkdownAttributes
>(
  node: Node
): JsonTagElNode => {
  if (node.markdown) {
    const htmlContent = convertMarkdownToHTML(node.markdown);
    // remove the markdown attribute after processing
    const { markdown, ...remainingAttributes } = node.attributes || {};

    return {
      ...node,
      content: htmlContent,
      attributes: remainingAttributes,
    };
  }
  return node;
};

export const markdownPlugin: HTMLodyPlugin<MarkdownAttributes> = {
  processNode: markdownPluginHandler,
};
