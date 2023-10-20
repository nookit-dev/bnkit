import { CSS_MAP } from "./constants";
import {
  JsonHtmlNodeMap,
  JsonTagElNode
} from "./html-type-engine";
import { ClassRecordAttributes } from "./htmlody-plugins";

export function generateCSS<
  NodeMap extends JsonHtmlNodeMap<
    JsonTagElNode<ClassRecordAttributes>
  > = JsonHtmlNodeMap<JsonTagElNode<ClassRecordAttributes>>
>(nodeMap: NodeMap): string {
  const usedClasses = new Set<string>();

  // Collect all used classes
  Object.values(nodeMap).forEach((node) => {
    if (node.cr) {
      Object.keys(node.cr).forEach((key) => {
        if (node.cr![key]) {
          key.split(" ").forEach((className) => usedClasses.add(className));
        }
      });
    }
  });

  // Generate CSS
  let cssStr = "";
  usedClasses.forEach((className) => {
    const cssName = CSS_MAP?.[className] as unknown as string | undefined;

    if (typeof CSS_MAP?.[className] === "string") {
      cssStr += `.${className} { ${CSS_MAP[className]} }\n`;
    }
  });

  return cssStr;
}
