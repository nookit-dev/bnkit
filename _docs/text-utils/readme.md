# Markdown Parser Module

This module provides utility functions to parse markdown syntax and convert it to HTML tags. The module exports the following functions:

- `replaceMarkdown(text: string, regex: RegExp, replacement: string): string`: replaces markdown syntax with the specified replacement string using the provided regular expression.
- `parseHeaders(text: string): string`: identifies header tags (h1 to h6) in the provided text and converts them to HTML header tags.
- `useMdToHtml()`: returns an object with the following functions to handle various markdown elements:
  - `parseBold(text: string): string`: identifies bold text in the provided text and converts it to HTML strong tags.
  - `parseItalic(text: string): string`: identifies italicized text in the provided text and converts it to HTML em tags.
  - `parseLinks(text: string): string`: identifies links in the provided text and converts them to HTML anchor tags.
  - `parseUnorderedLists(text: string): string`: identifies unordered list items in the provided text and converts them to HTML unordered list tags.
  - `parseOrderedLists(text: string): string`: identifies ordered list items in the provided text and converts them to HTML ordered list tags.

Additionally, the module exports a `templatingEngine` object, which is currently empty.

To use the module, simply import the desired functions and call them with the appropriate arguments. For example:

```javascript
import { parseHeaders, useMdToHtml } from 'markdown-parser';

const myMarkdown = '# My Header \n\nThis is **bold** text and this is *italic*.\n\n[This is a link](https://www.example.com).\n\n- This is an unordered list item.\n- So is this.\n\n1. This is an ordered list item.\n2. So is this.';

const formatted = parseHeaders(myMarkdown);
const { parseBold, parseItalic, parseLinks, parseUnorderedLists, parseOrderedLists } = useMdToHtml();

const finalFormatted = parseOrderedLists(parseUnorderedLists(parseLinks(parseItalic(parseBold(formatted)))));

console.log(finalFormatted);
// Output:
// <h1>My Header</h1>
// <p>This is <strong>bold</strong> text and this is <em>italic</em>.</p>
// <p><a href="https://www.example.com">This is a link</a>.</p>
// <ul><li>This is an unordered list item.</li><li>So is this.</li></ul><ol><li>This is an ordered list item.</li><li>So is this.</li></ol>
```

This will convert the provided markdown string to formatted HTML using the `parseHeaders` function for header tags and the `useMdToHtml` object to handle other markdown elements. The resulting HTML string can then be used in a web page or application.