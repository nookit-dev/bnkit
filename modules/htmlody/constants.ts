export const SELF_CLOSING_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "command",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

export const VALID_HTML_TAGS = new Set([
  // Metadata and scripting
  "base",
  "head",
  "link",
  "meta",
  "noscript",
  "script",
  "style",
  "title",

  // Sections
  "body",
  "footer",
  "header",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "nav",
  "section",

  // Grouping content
  "blockquote",
  "div",
  "figure",
  "hr",
  "li",
  "main",
  "ol",
  "p",
  "pre",
  "ul",

  // Text-level semantics
  "a",
  "abbr",
  "b",
  "br",
  "cite",
  "code",
  "data",
  "em",
  "i",
  "span",
  "strong",
  "time",
  "u",

  // Forms
  "button",
  "datalist",
  "fieldset",
  "form",
  "input",
  "label",
  "legend",
  "meter",
  "optgroup",
  "option",
  "output",
  "progress",
  "select",
  "textarea",

  // Embedded content
  "audio",
  "canvas",
  "embed",
  "iframe",
  "img",
  "map",
  "object",
  "picture",
  "source",
  "track",
  "video",

  // Tables
  "caption",
  "col",
  "colgroup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
]);

type CSSConfig = {
  spacing: Record<string, string>;
  colors: Record<string, string>;
};



const display = <Val extends string>(val: Val) => `display: ${val};` as const;
const dimension = <Val extends string>(prefix: string, val: Val) =>
  `${prefix}: ${val};` as const;
const textAlign = <Val extends string>(val: Val) =>
  `text-align: ${val};` as const;
const fontSize = <Val extends string>(val: Val) =>
  `font-size: ${val};` as const;
const color = <Val extends string>(val: Val) =>
  `background-color: ${val};` as const;
const border = <W extends string, S extends string, C extends string>(
  width: string,
  style: string,
  color: string
) => `border: ${width} ${style} ${color};` as const;

export const CSS_MAP = {
  // Display
  flex: display("flex"),
  grid: display("grid"),
  block: display("block"),
  hidden: display("none"),
  inline: display("inline"),
  "inline-block": display("inline-block"),

  // Margin & Padding
  "m-1": dimension("margin", "0.25rem"),
  "mt-1": dimension("margin-top", "0.25rem"),
  "mb-1": dimension("margin-bottom", "0.25rem"),
  "ml-1": dimension("margin-left", "0.25rem"),
  "mr-1": dimension("margin-right", "0.25rem"),

  "p-1": dimension("padding", "0.25rem"),
  "pt-1": dimension("padding-top", "0.25rem"),
  "pb-1": dimension("padding-bottom", "0.25rem"),
  "pl-1": dimension("padding-left", "0.25rem"),
  "pr-1": dimension("padding-right", "0.25rem"),

  // Width & Height
  "w-1/2": dimension("width", "50%"),
  "w-full": dimension("width", "100%"),
  "w-auto": dimension("width", "auto"),

  "h-1/2": dimension("height", "50%"),
  "h-full": dimension("height", "100%"),
  "h-auto": dimension("height", "auto"),

  // Flexbox Utilities
  "flex-row": "flex-direction: row;",
  "flex-row-reverse": "flex-direction: row-reverse;",
  "flex-col": "flex-direction: column;",
  "flex-col-reverse": "flex-direction: column-reverse;",

  "items-start": "align-items: flex-start;",
  "items-center": "align-items: center;",
  "items-end": "align-items: flex-end;",

  "justify-start": "justify-content: flex-start;",
  "justify-center": "justify-content: center;",
  "justify-end": "justify-content: flex-end;",

  // Grid Utilities
  "grid-cols-1": "grid-template-columns: repeat(1, minmax(0, 1fr));",
  "grid-cols-2": "grid-template-columns: repeat(2, minmax(0, 1fr));",
  "grid-cols-3": "grid-template-columns: repeat(3, minmax(0, 1fr));",
  "grid-cols-4": "grid-template-columns: repeat(4, minmax(0, 1fr));",

  // Text Utilities
  "text-left": textAlign("left"),
  "text-center": textAlign("center"),
  "text-right": textAlign("right"),

  "text-xs": fontSize("0.75rem"),
  "text-sm": fontSize("0.875rem"),
  "text-base": fontSize("1rem"),
  "text-lg": fontSize("1.125rem"),
  "text-xl": fontSize("1.25rem"),

  // Background Color
  "bg-red-500": color("#f56565"),
  

  // Border Utilities
  border: border("1px", "solid", "black"),
  "border-t": "border-top: 1px solid;",
  // ... and so on for other border sides.

  // ... (and many more utilities)
} as const;
