import { prettifyHTMLString, isSelfClosingTag } from "./module";

describe("prettifyHTMLString", () => {
  it("should format simple HTML string with indentation and line breaks", () => {
    const rawHTML = "<html><head><title>Test</title></head><body><p>Hello World!</p></body></html>";
    const expectedFormattedHTML = `<html>
  <head>
    <title>Test</title>
  </head>
  <body>
    <p>Hello World!</p>
  </body>
</html>`;
    expect(prettifyHTMLString(rawHTML)).toBe(expectedFormattedHTML);
  });

  it("should format nested HTML tags with indentation and line breaks", () => {
    const rawHTML = "<html><head><title>Test</title></head><body><div><p>Hello World!</p></div></body></html>";
    const expectedFormattedHTML = `<html>
  <head>
    <title>Test</title>
  </head>
  <body>
    <div>
      <p>Hello World!</p>
    </div>
  </body>
</html>`;
    expect(prettifyHTMLString(rawHTML)).toBe(expectedFormattedHTML);
  });

  it("should format self-closing HTML tags correctly", () => {
    const rawHTML = "<html><head /><body><p>Hello World!</p></body></html>";
    const expectedFormattedHTML = `<html>
  <head />
  <body>
    <p>Hello World!</p>
  </body>
</html>`;
    expect(prettifyHTMLString(rawHTML)).toBe(expectedFormattedHTML);
  });

  it("should handle incomplete HTML tags without breaking", () => {
    const rawHTML = "<html><head><title>Test<title></head><body><p>Hello World!</p></body></html>";
    const expectedFormattedHTML = `<html>
  <head>
    <title>Test<title>
  </head>
  <body>
    <p>Hello World!</p>
  </body>
</html>`;
    expect(prettifyHTMLString(rawHTML)).toBe(expectedFormattedHTML);
  });

  it("should handle HTML comments correctly", () => {
    const rawHTML = "<!-- This is a comment --><html><head><title>Test</title></head><body><p>Hello World!</p></body></html>";
    const expectedFormattedHTML = `<!-- This is a comment -->
<html>
  <head>
    <title>Test</title>
  </head>
  <body>
    <p>Hello World!</p>
  </body>
</html>`;
    expect(prettifyHTMLString(rawHTML)).toBe(expectedFormattedHTML);
  });

});

describe("isSelfClosingTag", () => {
  it("should return true for self-closing tags", () => {
    expect(isSelfClosingTag("<img src='image.png' />")).toBeTruthy();
    expect(isSelfClosingTag("<input type='text' />")).toBeTruthy();
    expect(isSelfClosingTag("<br />")).toBeTruthy();
  });

  it("should return false for non self-closing tags", () => {
    expect(isSelfClosingTag("<div><p>Hello World!</p></div>")).toBeFalsy();
    expect(isSelfClosingTag("<a href='#'>Link</a>")).toBeFalsy();
    expect(isSelfClosingTag("<textarea></textarea>")).toBeFalsy();
  });
});