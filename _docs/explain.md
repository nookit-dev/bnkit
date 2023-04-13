This file is a module that exports functions for prettifying HTML and parsing Markdown syntax into HTML tags. It depends on no other modules.

Features of the module:

- `prettifyHTMLString(rawHTML: string): string`: Takes a raw HTML string and returns a prettified version of it, with proper indentation and spacing around tags.
- `replaceMarkdown(text: string, regex: RegExp, replacement: string): string`: Utility function that replaces Markdown syntax in a string with a given replacement string.
- `parseHeaders(text: string): string`: Parses headers in Markdown syntax and returns an HTML string with corresponding header tags.
- `parseBold(text: string): string`: Parses bold text in Markdown syntax and returns an HTML string with `<strong>` tags around the bold text.
- `parseItalic(text: string): string`: Parses italic text in Markdown syntax and returns an HTML string with `<em>` tags around the italic text.
- `parseLinks(text: string): string`: Parses links in Markdown syntax and returns an HTML string with `<a>` tags and href attributes.
- `parseUnorderedLists(text: string): string`: Parses unordered lists in Markdown syntax and returns an HTML string with `<ul>` and `<li>` tags.
- `parseOrderedLists(text: string): string`: Parses ordered lists in Markdown syntax and returns an HTML string with `<ol>` and `<li>` tags.

Technical description:

The `prettifyHTMLString` function uses a regular expression to parse HTML tags in the input string, keeping track of opening and closing tags on a stack. It then calculates the proper indentation for each tag and inserts line breaks and spaces accordingly.

The Markdown parsing functions use regular expressions and the `replaceMarkdown` utility function to find and replace specific Markdown syntax with corresponding HTML tags. The `parseHeaders`, `parseUnorderedLists`, and `parseOrderedLists` functions use different regular expressions to parse headers and different types of lists, and then replace them with their corresponding HTML tags. The `parseBold`, `parseItalic`, and `parseLinks` functions all use the same basic regex pattern to match and replace their respective Markdown syntax.