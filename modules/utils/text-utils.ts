function repeat(s: string, n: number): string {
  let result = "";
  for (let i = 0; i < n; i++) {
    result += s;
  }
  return result;
}

function replaceMarkdown(
  text: string,
  regex: RegExp,
  replacement: string
): string {
  return text.replace(regex, replacement);
}

const parsers = {
  headers(text: string): string {
    for (let i = 6; i > 0; i--) {
      const regex = new RegExp(`^(#{${i}}) (.*)`, "gm");
      text = replaceMarkdown(text, regex, `<h${i}>$2</h${i}>`);
    }
    return text;
  },
  bold(text: string): string {
    return replaceMarkdown(text, /\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  },
  italic(text: string): string {
    return replaceMarkdown(text, /\*(.+?)\*/g, "<em>$1</em>");
  },
  links(text: string): string {
    return replaceMarkdown(text, /\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
  },
  unorderedLists(text: string): string {
    text = replaceMarkdown(text, /^-\s(.+)/gm, "<li>$1</li>");
    return text.replace(/<li>.*<\/li>/g, (match) => `<ul>${match}</ul>`);
  },
  orderedLists(text: string): string {
    text = replaceMarkdown(text, /^\d+\.\s(.+)/gm, "<li>$1</li>");
    return text.replace(/<li>.*<\/li>/g, (match) => `<ol>${match}</ol>`);
  },
  blockquotes(text: string): string {
    return replaceMarkdown(text, /^>\s(.+)/gm, "<blockquote>$1</blockquote>");
  },
  codeBlocks(text: string): string {
    return replaceMarkdown(text, /```(.+?)```/gs, "<pre><code>$1</code></pre>");
  },
  inlineCode(text: string): string {
    return replaceMarkdown(text, /`(.+?)`/g, "<code>$1</code>");
  },
};

function convertMarkdownToHTML(markdownText: string): string {
  let html = markdownText;
  for (const parser of Object.values(parsers)) {
    html = parser(html);
  }
  return html;
}

export { convertMarkdownToHTML, parsers, replaceMarkdown };
