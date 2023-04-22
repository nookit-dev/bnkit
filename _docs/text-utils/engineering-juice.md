Functions:
1. `prettifyHTMLString(rawHTML: string): string` - Input: `string`, Output: `string`. Formats raw HTML string by adding proper indentation and line breaks.
2. `replaceMarkdown(text: string, regex: RegExp, replacement: string): string` - Input: `string, RegExp, string`, Output: `string`. Replaces parts of a string that match a given regular expression with a replacement string.
3. `convertMarkdownToHTML(markdownText: string): string` - Input: `string`, Output: `string`. Converts markdown text to HTML format by applying various parsing rules.
4. `isSelfClosingTag(attributes: string): boolean` - Input: `string`, Output: `boolean`. Checks if the given HTML tag has a self-closing slash at the end.
5. `updateIndent(isOpeningTag: boolean, indent: number): number` - Input: `boolean, number`, Output: `number`. Updates the indentation level based on whether an HTML tag is an opening or closing one.