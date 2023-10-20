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
