This file defines a module that provides functions for prettifying HTML and parsing markdown syntax into HTML tags. It depends on regular expressions for parsing the HTML and markdown syntax.

Features:
- Prettify HTML: The `prettifyHTMLString` function takes in a raw HTML string and returns a formatted string with correct indentation for nested tags.
- Parse markdown headers: The `parseHeaders` function parses markdown headers (indicated by # symbols) and returns HTML heading tags.
- Parse bold and italic text: The module provides functions to parse bold and italic text in markdown syntax and return corresponding HTML tags.
- Parse links: The `parseLinks` function parses links in markdown syntax (indicated by square brackets and parentheses) and returns HTML anchor tags.
- Parse unordered and ordered lists: The module provides functions to parse unordered and ordered lists in markdown syntax and return corresponding HTML tags.

Technical description:
The `prettifyHTMLString` function uses a stack to keep track of opening and closing tags and updates the indent level accordingly. The regular expression `/<(?<closing>\/)?(?<tag>[^/\s>]+)(?<attributes>[^>]*)>/g` is used to match opening and closing HTML tags and extract the tag name and attributes. The `parseHeaders` function uses a loop to parse headers of different levels and replace them with corresponding HTML tags. The `parseBold`, `parseItalic`, and `parseLinks` functions use regular expressions to match and replace bold, italic, and link syntax in the input text. The `parseUnorderedLists` and `parseOrderedLists` functions use regular expressions to match and replace list syntax in the input text.