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
