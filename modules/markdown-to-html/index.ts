import {
    parseBold,
    parseHeaders,
    parseItalic,
    parseLinks,
    parseOrderedLists,
    parseUnorderedLists,
} from './markdown-to-html-parser';

// Main markdown to HTML parser function
export function markdownToHtml(markdown: string): string {
  let html = markdown;

  html = parseHeaders(html);
  html = parseBold(html);
  html = parseItalic(html);
  html = parseLinks(html);
  html = parseUnorderedLists(html);
  html = parseOrderedLists(html);

  return html;
}

