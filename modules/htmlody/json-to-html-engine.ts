import { SELF_CLOSING_TAGS } from "./constants";
import { generateCSS, generateColorVariables } from "./css-engine";
import {
  HTMLodyPlugin,
  classRecordPlugin,
  markdownPlugin,
} from "./htmlody-plugins";
import { ExtensionRec, JsonHtmlNodeTree, JsonTagElNode } from "./htmlody-types";
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
  children: JsonHtmlNodeTree,
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
  NodeMap extends JsonHtmlNodeTree<Node> = JsonHtmlNodeTree<Node>
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

const generateTitleNode = (title: string): JsonTagElNode => {
  return {
    tag: "title",
    content: title,
  };
};

const generateMetaTagNode = (meta: {
  name: string;
  content: string;
}): JsonTagElNode => {
  return {
    tag: "meta",
    attributes: { name: meta.name, content: meta.content },
  };
};

const generateLinkTagNode = (link: {
  rel: string;
  href: string;
}): JsonTagElNode => {
  return {
    tag: "link",
    attributes: { rel: link.rel, href: link.href },
  };
};

const generateScriptTagNode = (src: string): JsonTagElNode => {
  return {
    tag: "script",
    attributes: { src },
  };
};

const generateStyleTagNode = (content: string): JsonTagElNode => {
  return {
    tag: "style",
    content,
  };
};

export type NodePluginsReturn<Plugins extends HTMLodyPlugin<any>[]> =
  ReturnType<Plugins[number]["processNode"]>;

type HeadConfig = {
  title: string;
  metaTags?: { name: string; content: string }[];
  linkTags?: { rel: string; href: string }[];
  styleTags?: { content: string }[];
};

type ScriptLoadingOptions = {
  useHtmx?: boolean | string;
  // Add other script loading options as needed
};

export const htmlodyBuilder = <
  Plugins extends HTMLodyPlugin<any>[],
  PluginReturns extends NodePluginsReturn<Plugins>
>(
  plugins: Plugins,
  headConfig?: HeadConfig
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

  const renderNodeTreeToHtml = (
    nodeMap: JsonHtmlNodeTree,
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
    children: JsonHtmlNodeTree,
    pluginsOverride?: Plugins
  ): string => {
    const activePlugins = pluginsOverride || effectivePlugins;
    return Object.entries(children)
      .map(([childTagName, childNode]) =>
        renderNodeWithPlugins(childNode, activePlugins)
      )
      .join("");
  };

  const buildHtmlDoc = (
    bodyConfig: JsonHtmlNodeTree,
    options: {
      headConfig: HeadConfig;
      scriptOptions?: ScriptLoadingOptions;
    } = {
      headConfig: headConfig || {
        title: "HTMLody",
      },
      scriptOptions: {
        useHtmx: false,
      },
    }
  ) => {
    const headNodes: JsonHtmlNodeTree = {};

    if (options.headConfig.title) {
      headNodes["title"] = generateTitleNode(options.headConfig.title);
    }

    if (options.headConfig.metaTags) {
      options.headConfig.metaTags.forEach((meta, index) => {
        headNodes[`meta${index}`] = generateMetaTagNode(meta);
      });
    }

    if (options.headConfig.linkTags) {
      options.headConfig.linkTags.forEach((link, index) => {
        headNodes[`link${index}`] = generateLinkTagNode(link);
      });
    }

    if (options.headConfig.styleTags) {
      options.headConfig.styleTags.forEach((style, index) => {
        headNodes[`style${index}`] = generateStyleTagNode(style.content);
      });
    }

    if (options.scriptOptions?.useHtmx) {
      const htmxSrc =
        typeof options.scriptOptions.useHtmx === "string"
          ? options.scriptOptions.useHtmx
          : "https://unpkg.com/htmx.org";
      headNodes["htmxScript"] = generateScriptTagNode(htmxSrc);
    }

    const headHtml = jsonToHtml(headNodes, []);
    const bodyHtml = renderNodeTreeToHtml(bodyConfig);

    // todo this needs to be externalized since this is specific to the class records plugin
    const css = generateCSS(bodyConfig);
    const colorVariables = generateColorVariables();

    return `
      <!doctype html>
      <html>
        <head>
          ${headHtml}
          <style>${colorVariables}</style>
          <style>${css}</style>
        </head>
        <body>
          ${bodyHtml}
        </body>
      </html>
    `;
  };

  const response = (
    bodyConfig: JsonHtmlNodeTree,
    options: {
      headConfig: HeadConfig;
      scriptOptions?: ScriptLoadingOptions;
    }
  ) => {
    const html = buildHtmlDoc(bodyConfig, options);
    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  };

  return {
    createNode,
    renderNodeTreeToHtml,
    renderSingleNode,
    renderChildren,
    buildHtmlDoc,
    response,
  };
};

export const defaultBuilder = htmlodyBuilder(
  [markdownPlugin, classRecordPlugin],
  {
    title: "HTMLody",
    styleTags: [{ content: generateColorVariables() }],
  }
);
