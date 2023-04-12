import { expect, test } from "bun:test";
import { markdownToHtml } from "../markdown-to-html";
const markdown = `
# Header 1
## Header 2
### Header 3
#### Header 4
##### Header 5
###### Header 6

**Bold Text**
*Italic Text*

[Link](https://example.com)

- Unordered List Item 1
- Unordered List Item 2
- Unordered List Item 3

1. Ordered List Item 1
2. Ordered List Item 2
3. Ordered List Item 3
`;

test("Markdown To HTML Parser", () => {
  const input  = markdownToHtml(markdown);

  const expectedOutput = `\n<h1>Header 1</h1>\n<h2>Header 2</h2>\n<h3>Header 3</h3>\n<h4>Header 4</h4>\n<h5>Header 5</h5>\n<h6>Header 6</h6>\n\n<strong>Bold Text</strong>\n<em>Italic Text</em>\n\n<a href=\"https://example.com\">Link</a>\n\n<ul><ol><li>Unordered List Item 1</li></ol></ul>\n<ul><ol><li>Unordered List Item 2</li></ol></ul>\n<ul><ol><li>Unordered List Item 3</li></ol></ul>\n\n<ol><li>Ordered List Item 1</li></ol>\n<ol><li>Ordered List Item 2</li></ol>\n<ol><li>Ordered List Item 3</li></ol>\n`

  expect(markdownToHtml(markdown)).toBe(expectedOutput);
});
