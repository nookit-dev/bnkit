# HTML and Markdown Prettifier Module

This module provides functions to prettify HTML strings and convert markdown elements to HTML tags.

## Functions

### `prettifyHTMLString(rawHTML: string): string`

Given a raw HTML string, this function returns a formatted HTML string with properly indented tags.

### `replaceMarkdown(text: string, regex: RegExp, replacement: string): string`

Given a string of text, a regular expression, and a replacement string, this utility function returns a modified string with the matched regular expression replaced by the replacement string.

### `parseHeaders(text: string): string`

Given a string of text, this utility function converts markdown headers to HTML headers.

## Utility Functions

### `parseBold(text: string): string`

Given a string of text, this utility function converts markdown bold syntax to HTML strong tags.

### `parseItalic(text: string): string`

Given a string of text, this utility function converts markdown italic syntax to HTML em tags.

### `parseLinks(text: string): string`

Given a string of text, this utility function converts markdown link syntax to HTML anchor tags.

### `parseUnorderedLists(text: string): string`

Given a string of text, this utility function converts markdown unordered list syntax to HTML unordered list tags.

### `parseOrderedLists(text: string): string`

Given a string of text, this utility function converts markdown ordered list syntax to HTML ordered list tags.

## Exported Objects

### `useMdToHtml()`

This object returns the above utility functions as methods for easy use.