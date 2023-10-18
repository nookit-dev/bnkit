type Attributes = Record<string, string>;

type JsonTagElNode = {
  content?: string;
  children?: JsonHtmlNodeMap;
  attributes?: Attributes;
};

export type JsonHtmlNodeMap = {
  [tag: string]: JsonTagElNode;
};

type GenericNode<Node extends JsonTagElNode> = {
  content?: Node["content"];
  children?: Node["children"];
  attributes?: Node["attributes"];
};

export type GenericNodeMap<T extends JsonHtmlNodeMap = JsonHtmlNodeMap> = {
  [tag in keyof T]: T[tag];
};

type SafeExtractNodeKey<Node extends GenericNode<Node>> =
  Node extends GenericNode<infer Key> ? Key : never;

type ConvertAttributesToHtmlString<Attrs extends Attributes> = {
  [Key in keyof Attrs]: `${Key}="${Attrs[Key]}"`;
}[keyof Attrs];

type ContentOfChildrenHelper<
  Node extends JsonHtmlNodeMap,
  TagKey extends keyof Node = keyof Node
> = Node extends JsonHtmlNodeMap
  ? {
      [InnerTagKey in keyof Node]: ConstructHtmlTag<Node, InnerTagKey>;
    }[TagKey]
  : never;

type OpenTag<
  ParentNode extends JsonHtmlNodeMap,
  TagKey extends keyof ParentNode
> = `${"<"}${TagKey}${ParentNode[TagKey]["attributes"] extends Attributes
  ? ` ${ConvertAttributesToHtmlString<ParentNode[TagKey]["attributes"]>}`
  : ""}${">"}`;

type CloseTag<TagKey extends string> = `</${TagKey}>`;

type TagContent<
  ParentNode extends JsonHtmlNodeMap,
  TagKey extends keyof ParentNode
> = ParentNode[TagKey]["children"] extends JsonHtmlNodeMap
  ? ContentOfChildrenHelper<
      ParentNode[TagKey]["children"],
      keyof ParentNode[TagKey]["children"]
    >
  : ParentNode[TagKey]["content"];

type ConstructHtmlTag<
  ParentNode extends JsonHtmlNodeMap,
  TagKey extends keyof ParentNode = keyof ParentNode
> = `${OpenTag<ParentNode, TagKey>}${TagContent<
  ParentNode,
  TagKey
>}${CloseTag<TagKey>}`;

export type RecursiveConstructHtmlTag<HtmlInput extends JsonHtmlNodeMap> = {
  [TagKey in keyof HtmlInput]: ConstructHtmlTag<HtmlInput, TagKey>;
};
