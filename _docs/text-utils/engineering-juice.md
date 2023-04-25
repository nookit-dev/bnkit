Functions:
- prettifyHTMLString(rawHTML: string): string - receives a string of raw HTML code and returns a prettified version of it.
- replaceMarkdown(text: string, regex: RegExp, replacement: string): string - replaces all occurrences of a regular expression in a string with a replacement string.
- parsers: object - contains different functions that each parse a specific markdown syntax and return the corresponding HTML code. The object is structured as follows:

  - headers(text: string): string - receives a string of markdown text and returns the corresponding HTML code for any headers found in the text.
  - bold(text: string): string - receives a string of markdown text and returns the corresponding HTML code for any bold text found in the text.
  - italic(text: string): string - receives a string of markdown text and returns the corresponding HTML code for any italicized text found in the text.
  - links(text: string): string - receives a string of markdown text and returns the corresponding HTML code for any links found in the text.
  - unorderedLists(text: string): string - receives a string of markdown text and returns the corresponding HTML code for any unordered lists found in the text.
  - orderedLists(text: string): string - receives a string of markdown text and returns the corresponding HTML code for any ordered lists found in the text.
  - blockquotes(text: string): string - receives a string of markdown text and returns the corresponding HTML code for any blockquotes found in the text.
  - codeBlocks(text: string): string - receives a string of markdown text and returns the corresponding HTML code for any code blocks found in the text.
  - inlineCode(text: string): string - receives a string of markdown text and returns the corresponding HTML code for any inline code found in the text.
 
- convertMarkdownToHTML(markdownText: string): string - receives a string of raw markdown text and uses the parsers object to convert it to HTML code. Returns the resulting HTML code.