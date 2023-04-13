## Module Summary

This module provides utility functions for parsing and formatting HTML and markdown text. The main export is `prettifyHTMLString`, which takes a raw HTML string and formats it for better readability by indenting nested tags. Other exports include utility functions for parsing markdown syntax and replacing it with corresponding HTML tags.

## Exports

- `prettifyHTMLString(rawHTML: string): string` - Formats a raw HTML string by indenting nested tags for better readability.
- `replaceMarkdown(text: string, regex: RegExp, replacement: string): string` - Replaces instances of a regular expression in a string with a replacement string.
- `parseHeaders(text: string): string` - Parses markdown headers into corresponding HTML tags.
- `useMdToHtml()`: An object with the following methods for parsing various markdown syntax into HTML tags:
  - `parseBold(text: string): string`
  - `parseItalic(text: string): string`
  - `parseLinks(text: string): string`
  - `parseUnorderedLists(text: string): string`
  - `parseOrderedLists(text: string): string`
- `templatingEngine`: An empty object that currently does not hold any functionality.