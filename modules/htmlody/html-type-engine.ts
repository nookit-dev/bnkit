export type Attributes = Record<string, string>;

export type JsonTagElNode = {
  content?: string;
  children?: JsonHtmlNodeMap;
  attributes?: Attributes;
};

export type JsonHtmlNodeMap = {
  [tag: string]: JsonTagElNode;
};

export type GenericNodeMap<T extends JsonHtmlNodeMap = JsonHtmlNodeMap> = {
  [tag in keyof T]: T[tag];
};

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

export type TagContent<
  ParentNode extends JsonHtmlNodeMap,
  TagKey extends keyof ParentNode
> = ParentNode[TagKey]["children"] extends JsonHtmlNodeMap
  ? ContentOfChildrenHelper<
      ParentNode[TagKey]["children"],
      keyof ParentNode[TagKey]["children"]
    >
  : ParentNode[TagKey]["content"];

export type ConstructHtmlTag<
  ParentNode extends JsonHtmlNodeMap,
  TagKey extends keyof ParentNode = keyof ParentNode
> = `${OpenTag<ParentNode, TagKey>}${TagContent<
  ParentNode,
  TagKey
>}${CloseTag<TagKey>}`;

export type RecursiveConstructHtmlTag<HtmlInput extends JsonHtmlNodeMap> = {
  [TagKey in keyof HtmlInput]: ConstructHtmlTag<HtmlInput, TagKey>;
};

export type JsonHtmlHead = {
  title: string;
};

export type FullJsonHtmlDocStructure<
  Head extends JsonHtmlHead,
  Body extends JsonHtmlNodeMap
> = {
  html: {
    head: Head;
    body: Body;
  };
};

export type FunctionMap = {
  [key: string]: () => string;
};
