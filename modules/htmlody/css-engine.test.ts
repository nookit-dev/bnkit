import { describe, expect, it } from "bun:test";
import { JsonHtmlNodeMap, JsonTagElNode } from ".";
import {
  adjustBrightness,
  generateCSS,
  generateColorVariables,
  generateShades,
  generateVariablesForColor,
  hexToRgb,
  rgbToHex,
} from "./css-engine"; // Update this import path
import { ClassRecordAttributes } from "./htmlody-plugins";
import { nodeFactory } from "./htmlody-utils";

const createNode = nodeFactory({
  tag: "div",
}).create();

describe("generateCSS", () => {
  it("should generate correct CSS from nodeMap", () => {
    const mockNodeMap: JsonHtmlNodeMap<JsonTagElNode<ClassRecordAttributes>> = {
      exampleDiv: {
        tag: "div",
        cr: {
          "*": {
            flex: true,
            "m-1": true,
            grid: false,
            "w-1/2": true,
          },
        },
      },
      exampleSpan: {
        tag: "span",
        cr: {
          "*": {
            "h-1/2": true,
            "p-1": true,
            flex: false,
          },
        },
      },
    };

    const result = generateCSS(mockNodeMap);
    const expectedCss =
      `.flex { display: flex; }\n` +
      `.m-1 { margin: 0.25rem; }\n` +
      `.w-1/2 { width: 50%; }\n` +
      `.h-1/2 { height: 50%; }\n` +
      `.p-1 { padding: 0.25rem; }\n`;

    expect(result).toEqual(expectedCss);
  });
  it("should return empty string for empty nodeMap", () => {
    const mockNodeMap: JsonHtmlNodeMap<JsonTagElNode<ClassRecordAttributes>> =
      {};

    const result = generateCSS(mockNodeMap);
    expect(result).toEqual("");
  });

  it("should handle nodes without the cr property", () => {
    const mockNodeMap: JsonHtmlNodeMap<JsonTagElNode<ClassRecordAttributes>> = {
      exampleDiv: {
        tag: "div",
      },
    };

    const result = generateCSS(mockNodeMap);
    expect(result).toEqual("");
  });

  it("should ignore invalid class names", () => {
    const mockNodeMap: JsonHtmlNodeMap<JsonTagElNode<ClassRecordAttributes>> = {
      exampleDiv: {
        tag: "div",
        cr: {
          "*": {
            "invalid-class": true,
          },
        },
      },
    };

    const result = generateCSS(mockNodeMap);
    expect(result).toEqual(""); // No CSS generated for invalid class names
  });

  it("should not generate CSS if all classes are set to false", () => {
    const mockNodeMap: JsonHtmlNodeMap<JsonTagElNode<ClassRecordAttributes>> = {
      exampleDiv: {
        tag: "div",
        cr: {
          "*": {
            flex: false,
            "m-1": false,
          },
        },
      },
    };

    const result = generateCSS(mockNodeMap);
    expect(result).toEqual(""); // No CSS generated
  });
});

import { bgColorGen, borderColorGen, textColorGen } from "./css-engine";

describe("textColorGen", () => {
  it("should generate a CSS property value for text color", () => {
    const result = textColorGen("red", 500);
    expect(result["text-red-500"]).toBe("color: var(--red-500);");
  });

  it("should generate a CSS property value for text color with a different shade", () => {
    const result = textColorGen("red", 600);
    expect(result["text-red-600"]).toBe("color: var(--red-600);");
  });
});

describe("bgColorGen", () => {
  it("should generate a CSS property value for background color", () => {
    const result = bgColorGen("red", 500);
    expect(result["bg-red-500"]).toBe("background-color: var(--red-500);");
  });
});

describe("borderColorGen", () => {
  it("should generate a CSS property value for border color", () => {
    const result = borderColorGen("red", 500);
    expect(result["border-red-500"]).toBe("border-color: var(--red-500);");
  });

  it("should generate a CSS property value for border color with a different shade", () => {
    const result = borderColorGen("red", 600);
    expect(result["border-red-600"]).toBe("border-color: var(--red-600);");
  });
});

describe("generateColorVariables", () => {
  it("should generate CSS variables for colors", () => {
    const result = generateColorVariables();

    expect(result).toContain(`--red-50`);

    expect(result).toContain(":root {\n--red-50: #1A0000;");
    expect(result).toContain("--slate-300: #2D333A;");
  });
});

describe("generateShades", () => {
  it("should generate shades of a color", () => {
    const result = generateShades("red");
    expect(result).toHaveLength(10);

    result.forEach((shade) => {
      // validate that each shade is a valid hex color
      expect(shade).toHaveLength(7);
    });

    expect(result[0][0]).toBe("#"); // first shade, first charact
  });
});

describe("generateVariablesForColor", () => {
  it("should generate CSS variables for shades of a color", () => {
    const result = generateVariablesForColor("red");
    expect(result).toBe(
      "--red-50: #1A0000;\n--red-100: #330000;\n--red-200: #4D0000;\n--red-300: #660000;\n--red-400: #800000;\n--red-500: #990000;\n--red-600: #B30000;\n--red-700: #CC0000;\n--red-800: #E60000;\n--red-900: #FF0000;\n"
    );
  });

  it("should generate CSS variables for shades of a different color", () => {
    const result = generateVariablesForColor("blue");
    expect(result).toBe(
      "--blue-50: #00001A;\n--blue-100: #000033;\n--blue-200: #00004D;\n--blue-300: #000066;\n--blue-400: #000080;\n--blue-500: #000099;\n--blue-600: #0000B3;\n--blue-700: #0000CC;\n--blue-800: #0000E6;\n--blue-900: #0000FF;\n"
    );
  });
});

describe("hexToRgb", () => {
  it("should convert a hex color to an RGB object", () => {
    const result = hexToRgb("#ff0000");
    expect(result).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("should return null for an invalid hex color", () => {
    const result = hexToRgb("invalid");
    expect(result).toBeNull();
  });
});

describe("rgbToHex", () => {
  it("should convert an RGB color to a hex string", () => {
    const result = rgbToHex(255, 0, 0);
    expect(result).toBe("#FF0000");
  });

  it("should handle zero values correctly", () => {
    const result = rgbToHex(0, 0, 0);
    expect(result).toBe("#000000");
  });
});

describe("adjustBrightness", () => {
  it("should adjust the brightness of an RGB color", () => {
    const result = adjustBrightness({ r: 255, g: 0, b: 0 }, 1.5);
    expect(result).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("should not exceed the maximum brightness value", () => {
    const result = adjustBrightness({ r: 255, g: 255, b: 255 }, 10);
    expect(result).toEqual({ r: 255, g: 255, b: 255 });
  });

  it("should not go below the minimum brightness value", () => {
    const result = adjustBrightness({ r: 0, g: 0, b: 0 }, 0.1);
    expect(result).toEqual({ r: 0, g: 0, b: 0 });
  });
});
