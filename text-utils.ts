type TagInfo = {
  tag: string;
  start: number;
  end: number;
};

function isSelfClosingTag(attributes: string): boolean {
  return /\/\s*>$/.test(attributes);
}

function updateIndent(isOpeningTag: boolean, indent: number): number {
  if (isOpeningTag) {
    return indent - 2;
  } else {
    return indent + 2;
  }
}

export function prettifyHTMLString(rawHTML: string): string {
  const stack: TagInfo[] = [];
  let formattedHTML = "";
  let indent = 0;

  const regex = /<(?<closing>\/)?(?<tag>[^/\s>]+)(?<attributes>[^>]*)>/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(rawHTML)) !== null) {
    const { closing, tag, attributes } = match.groups as {
      closing: string | undefined;
      tag: string;
      attributes: string;
    };
    const isOpeningTag = !closing;

    if (isOpeningTag && !isSelfClosingTag(attributes)) {
      formattedHTML += rawHTML.slice(
        stack.length ? stack[stack.length - 1].end : 0,
        match.index
      );
      stack.push({ tag, start: match.index, end: regex.lastIndex });
    } else {
      const lastTag = stack.pop();
      if (!lastTag) {
        continue;
      }
      const indentation = " ".repeat(indent);

      formattedHTML +=
        rawHTML.slice(lastTag.end, match.index) +
        rawHTML.slice(lastTag.start, lastTag.end).replace(/^/gm, indentation) +
        rawHTML.slice(match.index, regex.lastIndex).replace(/^/gm, indentation);

      indent = updateIndent(isOpeningTag, indent);
    }
  }

  formattedHTML += rawHTML.slice(
    stack.length ? stack[stack.length - 1].end : 0
  );

  return formattedHTML;
}

// Utility function to replace markdown syntax with HTML tags
function replaceMarkdown(
  text: string,
  regex: RegExp,
  replacement: string
): string {
  return text.replace(regex, replacement);
}

// Utility functions to handle various markdown elements
function parseHeaders(text: string): string {
  for (let i = 6; i > 0; i--) {
    const regex = new RegExp(`^(#{${i}}) (.*)`, "gm");
    text = replaceMarkdown(text, regex, `<h${i}>$2</h${i}>`);
  }
  return text;
}

const useMdToHtml = () => {
  return {
    parseBold(text: string): string {
      return replaceMarkdown(text, /\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    },

    parseItalic(text: string): string {
      return replaceMarkdown(text, /\*(.+?)\*/g, "<em>$1</em>");
    },

    parseLinks(text: string): string {
      return replaceMarkdown(
        text,
        /\[(.+?)\]\((.+?)\)/g,
        '<a href="$2">$1</a>'
      );
    },

    parseUnorderedLists(text: string): string {
      text = replaceMarkdown(text, /^-\s(.+)/gm, "<li>$1</li>");
      return text.replace(/<li>.*<\/li>/g, (match) => `<ul>${match}</ul>`);
    },

    parseOrderedLists(text: string): string {
      text = replaceMarkdown(text, /^\d+\.\s(.+)/gm, "<li>$1</li>");
      return text.replace(/<li>.*<\/li>/g, (match) => `<ol>${match}</ol>`);
    },
  };
};

export { replaceMarkdown, parseHeaders };

export const templatingEngine = {};
