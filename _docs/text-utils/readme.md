# HTML Markdown Parser

This module contains utility functions to convert markdown syntax into HTML tags, as well as a function to prettify an HTML string.

## Functions

### `prettifyHTMLString(rawHTML: string): string`

This function takes in a raw HTML string and returns a prettified version with proper indentation for readability.

### `replaceMarkdown(text: string, regex: RegExp, replacement: string): string`

This utility function takes in a text string, a regex to match the markdown syntax, and a string to replace the matched text with.

### `parseHeaders(text: string): string`

This function takes in a text string and converts any markdown header syntax into the corresponding HTML header tags.

### `useMdToHtml()`

This function returns an object with various functions to handle different markdown syntax elements, including bold, italic, links, and unordered/ordered lists.

## `templatingEngine`

This object is currently empty and can be used for any additional templating functions you may want to add.

---

## Example Usage

```typescript
import { replaceMarkdown, parseHeaders, useMdToHtml } from 'html-markdown-parser';

const mdToHtml = useMdToHtml();

const exampleText = `
# This is a header
## This is a subheader
### This is a subsubheader

- This is an unordered list item
- This is another unordered list item

1. This is an ordered list item
2. This is another ordered list item

**This text is bold**
*This text is italic*
[This is a link](https://www.example.com/)
`;

let htmlOutput = parseHeaders(exampleText);

htmlOutput = mdToHtml.parseBold(htmlOutput);
htmlOutput = mdToHtml.parseItalic(htmlOutput);
htmlOutput = mdToHtml.parseLinks(htmlOutput);
htmlOutput = mdToHtml.parseUnorderedLists(htmlOutput);
htmlOutput = mdToHtml.parseOrderedLists(htmlOutput);

console.log(htmlOutput);
```

Output:

```html
<h1>This is a header</h1>
<h2>This is a subheader</h2>
<h3>This is a subsubheader</h3>

<ul>
  <li>This is an unordered list item</li>
  <li>This is another unordered list item</li>
</ul>

<ol>
  <li>This is an ordered list item</li>
  <li>This is another ordered list item</li>
</ol>

<strong>This text is bold</strong>
<em>This text is italic</em>
<a href="https://www.example.com/">This is a link</a>
```