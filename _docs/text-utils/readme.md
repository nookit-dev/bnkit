# Markdown Parser Module

This is a Node.js module that can be used to parse markdown syntax and convert it to HTML.

### Functions

- `replaceMarkdown(text: string, regex: RegExp, replacement: string): string` - Replaces text that matches a given regular expression with a specified replacement.
- `convertMarkdownToHTML(markdownText: string): string` - Converts markdown syntax to HTML by applying a series of parsing functions to the text.

### Parsers

The module provides the following parsers:

- `headers` - Parses up to six levels of header syntax (`#`).
- `bold` - Parses bold syntax (`**`).
- `italic` - Parses italic syntax (`*`).
- `links` - Parses link syntax (`[]()`).
- `unorderedLists` - Parses unordered list syntax (`-`).
- `orderedLists` - Parses ordered list syntax (`1.`).
- `blockquotes` - Parses blockquote syntax (`>`).
- `codeBlocks` - Parses code block syntax (`` ``` ``).
- `inlineCode` - Parses inline code syntax (`\``).

### Example Usage

```javascript
const { convertMarkdownToHTML } = require('markdown-parser-module');

const markdownText = '# Hello World\n\nThis is **bold** and this is *italic*. Click [here](https://example.com) to visit a link.\n\n- This is an unordered list item\n- This is another unordered list item\n\n1. This is an ordered list item\n2. This is another ordered list item\n\n> This is a blockquote.\n\n```\nconsole.log("This is a code block");\n```\n\nInline `code` is also supported.';

const html = convertMarkdownToHTML(markdownText);

console.log(html);
```

Output:

```html
<h1>Hello World</h1>

<p>This is <strong>bold</strong> and this is <em>italic</em>. Click <a href="https://example.com">here</a> to visit a link.</p>

<ul>
<li>This is an unordered list item</li>
<li>This is another unordered list item</li>
</ul>

<ol>
<li>This is an ordered list item</li>
<li>This is another ordered list item</li>
</ol>

<blockquote>
<p>This is a blockquote.</p>
</blockquote>

<pre><code>console.log("This is a code block");
</code></pre>

<p>Inline <code>code</code> is also supported.</p>
```