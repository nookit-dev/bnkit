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

function parseBold(text: string): string {
  return replaceMarkdown(text, /\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function parseItalic(text: string): string {
  return replaceMarkdown(text, /\*(.+?)\*/g, "<em>$1</em>");
}

function parseLinks(text: string): string {
  return replaceMarkdown(text, /\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
}

function parseUnorderedLists(text: string): string {
  text = replaceMarkdown(text, /^-\s(.+)/gm, "<li>$1</li>");
  return text.replace(/<li>.*<\/li>/g, (match) => `<ul>${match}</ul>`);
}

function parseOrderedLists(text: string): string {
  text = replaceMarkdown(text, /^\d+\.\s(.+)/gm, "<li>$1</li>");
  return text.replace(/<li>.*<\/li>/g, (match) => `<ol>${match}</ol>`);
}

export {
  replaceMarkdown,
  parseHeaders,
  parseBold,
  parseItalic,
  parseLinks,
  parseUnorderedLists,
  parseOrderedLists,
};
