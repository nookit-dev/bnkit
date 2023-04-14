This module provides a number of functions and utilities for working with HTML and Markdown:

exports:
- `prettifyHTMLString(rawHTML: string): string`: Formats an HTML string with proper indentation and formatting
- `replaceMarkdown(text: string, regex: RegExp, replacement: string): string`: Replaces Markdown syntax with HTML tags
- `parseHeaders(text: string): string`: Parses Markdown headers into HTML headings
- `templatingEngine`: An empty object that can be used as a starting point for building a templating engine. 

Additionally, the `useMdToHtml()` function returns an object with several methods for parsing various Markdown elements into HTML, including:
- `parseBold(text: string): string`: Parses double asterisks (`**text**`) into HTML strong tags
- `parseItalic(text: string): string`: Parses single asterisks (`*text*`) into HTML emphasis tags
- `parseLinks(text: string): string`: Parses links (`[text](url)`) into HTML anchor tags
- `parseUnorderedLists(text: string): string`: Parses unordered lists (`- list item`) into HTML unordered lists
- `parseOrderedLists(text: string): string`: Parses ordered lists (`1. list item`) into HTML ordered lists.

Overall, this module provides helpful tools for working with HTML and Markdown, making it easier to parse and format text for use on the web.