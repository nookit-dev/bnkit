import { JsonHtmlNodeMap, JsonTagElNode } from "./html-type-engine";
import { ClassRecordAttributes } from "./htmlody-plugins";

//
const fractionPercentMap = {
  "1/2": 50,
  "1/3": 33.333333,
  "2/3": 66.666667,
  "1/4": 25,
  "2/4": 50,
  "3/4": 75,
  "1/5": 20,
  "2/5": 40,
  "3/5": 60,
  "4/5": 80,
  "1/6": 16.666667,
  "2/6": 33.333333,
  "3/6": 50,
  "4/6": 66.666667,
  "5/6": 83.333333,
  "1/12": 8.333333,
  "2/12": 16.666667,
  "3/12": 25,
  "4/12": 33.333333,
  "5/12": 41.666667,
  "6/12": 50,
  "7/12": 58.333333,
  "8/12": 66.666667,
  "9/12": 75,
  "10/12": 83.333333,
  "11/12": 91.666667,
} as const;

type FractionPercentMapT = typeof fractionPercentMap;

type CSSConfig = {
  spacing: Record<string, string>;
  colors: Record<string, string>;
};

const textAlign = <Val extends string>(val: Val) =>
  `text-align: ${val};` as const;
const fontSize = <Val extends string>(val: Val) =>
  `font-size: ${val};` as const;
const color = <Val extends string>(val: Val) =>
  `background-color: ${val};` as const;
const border = <W extends string, S extends string, C extends string>(
  width: string,
  style: string,
  color: string
) => `border: ${width} ${style} ${color};` as const;

export function generateCSS<
  NodeMap extends JsonHtmlNodeMap<
    JsonTagElNode<ClassRecordAttributes>
  > = JsonHtmlNodeMap<JsonTagElNode<ClassRecordAttributes>>
>(nodeMap: NodeMap): string {
  const usedClasses = new Set<string>();

  // Collect all used classes
  Object.values(nodeMap).forEach((node) => {
    if (node.cr) {
      Object.keys(node.cr).forEach((key) => {
        if (node.cr![key]) {
          key.split(" ").forEach((className) => usedClasses.add(className));
        }
      });
    }
  });

  // Generate CSS
  let cssStr = "";
  usedClasses.forEach((className) => {
    const cssName = CSS_MAP?.[className] as unknown as string | undefined;

    if (typeof CSS_MAP?.[className] === "string") {
      cssStr += `.${className} { ${CSS_MAP[className]} }\n`;
    }
  });

  return cssStr;
}

type CSSFactory = (config: CSSConfig) => Record<string, string>;

const createKeyVal = <Key extends string, Val extends string>(
  key: Key,
  val: Val
) => {
  const obj = {
    [key]: val,
  } as {
    [K in Key]: Val;
  };

  return obj;
};

const cssPropertyValueGen = <
  ClassAbbrevKey extends string,
  Property extends string,
  Value extends number | string,
  Unit extends string
>(
  classAbbrevKey: ClassAbbrevKey,
  property: Property,
  value: Value,
  unit: Unit
) => {
  const cssGen = `${property}: ${value}${unit};` as const;

  return {
    [classAbbrevKey]: cssGen,
  } as {
    [K in ClassAbbrevKey]: typeof cssGen;
  };
};

type CSSUnits = "rem" | "px" | "%" | "em";

const sizingHelper = <
  ClassValKey extends number,
  Value extends number | string,
  Unit extends CSSUnits
>(
  classValKey: ClassValKey,
  value: Value,
  unit: Unit
) => {
  return {
    ...cssPropertyValueGen(`w-${classValKey}`, "width", value, unit),
    ...cssPropertyValueGen(`h-${classValKey}`, "height", value, unit),
  } as const;
};

const fractionHelper = <
  ClassAbbrevKey extends string,
  Fraction extends keyof FractionPercentMapT,
  Property extends string
>(
  classAbbrevKey: ClassAbbrevKey,
  fraction: Fraction,
  property: Property
) => {
  const percentageValue = fractionPercentMap[fraction];

  return cssPropertyValueGen(
    `${classAbbrevKey}-${fraction}`,
    property,
    percentageValue,
    "%"
  );
};

const fractionHelperRes = fractionHelper("w", "1/2", "width");

const sizeFractions = <Fraction extends keyof FractionPercentMapT>(
  fraction: Fraction
) => {
  return {
    ...fractionHelper("w", fraction, "width"),
    ...fractionHelper("h", fraction, "height"),
  };
};

const spacingHelper = <
  ClassAbbrevKey extends number,
  Val extends number,
  Unit extends CSSUnits
>(
  marginFactorKey: ClassAbbrevKey,
  value: Val,
  unit: Unit
) => {
  return {
    ...createKeyVal(`m-${marginFactorKey}`, `margin: ${value}${unit};`),
    ...createKeyVal(`mt-${marginFactorKey}`, `margin-top: ${value}${unit};`),
    ...createKeyVal(`mb-${marginFactorKey}`, `margin-bottom: ${value}${unit};`),
    ...createKeyVal(`ml-${marginFactorKey}`, `margin-left: ${value}${unit};`),
    ...createKeyVal(`mr-${marginFactorKey}`, `margin-right: ${value}${unit};`),
    ...createKeyVal(
      `mx-${marginFactorKey}`,
      `margin-left: ${value}${unit}; margin-right: ${value}${unit};`
    ),
    ...createKeyVal(
      `my-${marginFactorKey}`,
      `margin-top: ${value}${unit}; margin-bottom: ${value}${unit};`
    ),

    ...createKeyVal(`p-${marginFactorKey}`, `padding: ${value}${unit};`),
    ...createKeyVal(`pt-${marginFactorKey}`, `padding-top: ${value}${unit};`),
    ...createKeyVal(
      `pb-${marginFactorKey}`,
      `padding-bottom: ${value}${unit};`
    ),
    ...createKeyVal(`pl-${marginFactorKey}`, `padding-left: ${value}${unit};`),
    ...createKeyVal(`pr-${marginFactorKey}`, `padding-right: ${value}${unit};`),
    ...createKeyVal(
      `px-${marginFactorKey}`,
      `padding-left: ${value}${unit}; padding-right: ${value}${unit};`
    ),
    ...createKeyVal(
      `py-${marginFactorKey}`,
      `padding-top: ${value}${unit}; padding-bottom: ${value}${unit};`
    ),
  } as const;
};

// Test
const result = spacingHelper(1, 0.25, "rem");
const result2 = spacingHelper(2, 0.25, "rem");

const combined = {
  ...result,
  ...result2,
};

type ColorShades = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

type TypeColors =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "indigo"
  | "purple"
  | "pink"
  | "slate"
  | "gray";

type ColorMap = {
  [Key in TypeColors]: {
    [Key in ColorShades]: string;
  };
};

const baseColors: Record<TypeColors, string> = {
  red: "#f00",
  orange: "#f60",
  yellow: "#ff0",
  green: "#0f0",
  blue: "#00f",
  indigo: "#4b0082",
  purple: "#800080",
  pink: "#ffc0cb",
  slate: "#708090",
  gray: "#808080",
};

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

const adjustBrightness = <Color extends string, Factor extends number>(
  color: Color,
  factor: Factor
) => {
  const { r, g, b } = hexToRgb(color);
  const adjust = (color: number) =>
    Math.min(255, Math.max(0, color * factor)).toFixed(0);
  return `#${adjust(r)}${adjust(g)}${adjust(b)}`;
};

const generateShades = <Color extends string>(
  color: Color
): Record<ColorShades, Color | string> => {
  const shades: Record<ColorShades, Color | string> = {} as Record<
    ColorShades,
    Color | string
  >;
  // A function to adjust the brightness of a color

  // Generate shades
  shades[50] = adjustBrightness(color, 1.5);
  shades[100] = adjustBrightness(color, 1.4);
  shades[200] = adjustBrightness(color, 1.3);
  shades[300] = adjustBrightness(color, 1.2);
  shades[400] = adjustBrightness(color, 1.1);
  shades[500] = color;
  shades[600] = adjustBrightness(color, 0.9);
  shades[700] = adjustBrightness(color, 0.8);
  shades[800] = adjustBrightness(color, 0.7);
  shades[900] = adjustBrightness(color, 0.6);
  return shades;
};

const colorMap: ColorMap = Object.fromEntries(
  Object.entries(baseColors).map(([type, color]) => [
    type,
    generateShades(color),
  ])
) as ColorMap;

const textColorGen = <Color extends string, Shade extends ColorShades>(
  color: Color,
  shade: Shade
) => {
  return cssPropertyValueGen(
    `text-${color}-${shade}`,
    "color",
    `var(--${color}-${shade})`,
    ""
  );
};

const bgColorGen = <Color extends string, Shade extends ColorShades>(
  color: Color,
  shade: Shade
) => {
  return cssPropertyValueGen(
    `bg-${color}-${shade}`,
    "background-color",
    `var(--${color}-${shade})`,
    ""
  );
};

// const colorRes = bgColorGen("red", 500);

const borderColorGen = <Color extends string, Shade extends ColorShades>(
  color: Color,
  shade: Shade
) => {
  return cssPropertyValueGen(
    `border-${color}-${shade}`,
    "border-color",
    `var(--${color}-${shade})`,
    ""
  );
};

const generatePropertiesForColor = <Color extends TypeColors>(
  colorKey: Color
) => {
  // const color = baseColors[colorKey];

  // const shades = generateShades(color);

  // generate all text colors  and shades
  const text50 = textColorGen(colorKey, 50);
  const text100 = textColorGen(colorKey, 100);
  const text200 = textColorGen(colorKey, 200);
  const text300 = textColorGen(colorKey, 300);
  const text400 = textColorGen(colorKey, 400);
  const text500 = textColorGen(colorKey, 500);
  const text600 = textColorGen(colorKey, 600);
  const text700 = textColorGen(colorKey, 700);
  const text800 = textColorGen(colorKey, 800);
  const text900 = textColorGen(colorKey, 900);

  // generate all bg colors and shades
  const bg50 = bgColorGen(colorKey, 50);
  const bg100 = bgColorGen(colorKey, 100);
  const bg200 = bgColorGen(colorKey, 200);
  const bg300 = bgColorGen(colorKey, 300);
  const bg400 = bgColorGen(colorKey, 400);
  const bg500 = bgColorGen(colorKey, 500);
  const bg600 = bgColorGen(colorKey, 600);
  const bg700 = bgColorGen(colorKey, 700);
  const bg800 = bgColorGen(colorKey, 800);
  const bg900 = bgColorGen(colorKey, 900);

  // generate all border colors and shades
  const border50 = borderColorGen(colorKey, 50);
  const border100 = borderColorGen(colorKey, 100);
  const border200 = borderColorGen(colorKey, 200);
  const border300 = borderColorGen(colorKey, 300);
  const border400 = borderColorGen(colorKey, 400);
  const border500 = borderColorGen(colorKey, 500);
  const border600 = borderColorGen(colorKey, 600);
  const border700 = borderColorGen(colorKey, 700);
  const border800 = borderColorGen(colorKey, 800);
  const border900 = borderColorGen(colorKey, 900);

  return {
    ...text50,
    ...text100,
    ...text200,
    ...text300,
    ...text400,
    ...text500,
    ...text600,
    ...text700,
    ...text800,
    ...text900,
    ...bg50,
    ...bg100,
    ...bg200,
    ...bg300,
    ...bg400,
    ...bg500,
    ...bg600,
    ...bg700,
    ...bg800,
    ...bg900,
    ...border50,
    ...border100,
    ...border200,
    ...border300,
    ...border400,
    ...border500,
    ...border600,
    ...border700,
    ...border800,
    ...border900,
  };
};

// const generateColorUtilities = <
//   ColorMapT extends ColorMap,
//   ColorKeys extends keyof ColorMapT = keyof ColorMapT,
//   ShadeKey extends keyof ColorMapT[ColorKeys] = keyof ColorMapT[ColorKeys],
//   Shade extends ColorMapT[ColorKeys][ShadeKey] = ColorMapT[ColorKeys][ShadeKey]
// >(
//   colorMap: ColorMapT
// ) => {
//   let utilities = {};

//   const keys = Object.keys(colorMap) as ColorKeys[];
//   for (let i = 0; keys.length; i++) {
//     const color = keys[i];

//     if (color in colorMap) {
//       const shades = Object.keys(
//         colorMap[color]
//       ) as (keyof ColorMapT[ColorKeys])[];
//       for (let j = 0; j < shades.length; j++) {
//         const shade = shades[j];
//         const value = colorMap[color][shade];
//         if (typeof value === "string") {
//           // Make sure value is a string
//           utilities = {
//             ...utilities,
//             ...textColorGen(color, value),
//             ...bgColorGen(color, value),
//             ...borderColorGen(color, value),
//           };
//         }
//       }
//     }
//   }

//   return utilities as Record<
//     | keyof ReturnType<typeof textColorGen<ColorKeys, ShadeKey>>
//     | keyof ReturnType<typeof bgColorGen<ColorKeys, Shade>>
//     | keyof ReturnType<typeof borderColorGen<ColorKeys, Shade>>,
//     string
//   >;
// };

// const colorUtilities = generateColorUtilities(colorMap);

export const CSS_MAP = {
  ...spacingHelper(0.5, 0.125, "rem"),
  ...spacingHelper(1, 0.25, "rem"),
  ...spacingHelper(1.5, 0.375, "rem"),
  ...spacingHelper(2, 0.5, "rem"),
  ...spacingHelper(2.5, 0.625, "rem"),
  ...spacingHelper(3, 0.75, "rem"),
  ...spacingHelper(3.5, 0.875, "rem"),
  ...spacingHelper(4, 1, "rem"),
  ...spacingHelper(5, 1.25, "rem"),
  ...spacingHelper(6, 1.5, "rem"),
  ...spacingHelper(7, 1.75, "rem"),
  ...spacingHelper(8, 2, "rem"),
  ...spacingHelper(9, 2.25, "rem"),
  ...spacingHelper(10, 2.5, "rem"),
  ...spacingHelper(11, 2.75, "rem"),
  ...spacingHelper(12, 3, "rem"),
  ...spacingHelper(14, 3.5, "rem"),
  ...spacingHelper(16, 4, "rem"),
  ...spacingHelper(20, 5, "rem"),
  ...spacingHelper(24, 6, "rem"),
  ...spacingHelper(28, 7, "rem"),
  ...spacingHelper(32, 8, "rem"),
  ...spacingHelper(36, 9, "rem"),
  ...spacingHelper(40, 10, "rem"),
  ...spacingHelper(44, 11, "rem"),
  ...spacingHelper(48, 12, "rem"),
  ...spacingHelper(52, 13, "rem"),
  ...spacingHelper(56, 14, "rem"),
  ...spacingHelper(60, 15, "rem"),
  ...spacingHelper(64, 16, "rem"),
  ...spacingHelper(72, 18, "rem"),
  ...spacingHelper(80, 20, "rem"),
  ...spacingHelper(96, 24, "rem"),
  ...sizingHelper(0.5, 0.125, "rem"),
  ...sizingHelper(1, 0.25, "rem"),
  ...sizingHelper(1.5, 0.375, "rem"),
  ...sizingHelper(2, 0.5, "rem"),
  ...sizingHelper(2.5, 0.625, "rem"),
  ...sizingHelper(3, 0.75, "rem"),
  ...sizingHelper(3.5, 0.875, "rem"),
  ...sizingHelper(4, 1, "rem"),
  ...sizingHelper(5, 1.25, "rem"),
  ...sizingHelper(6, 1.5, "rem"),
  ...sizingHelper(7, 1.75, "rem"),
  ...sizingHelper(8, 2, "rem"),
  ...sizingHelper(9, 2.25, "rem"),
  ...sizingHelper(10, 2.5, "rem"),
  ...sizingHelper(11, 2.75, "rem"),
  ...sizingHelper(12, 3, "rem"),
  ...sizingHelper(14, 3.5, "rem"),
  ...sizingHelper(16, 4, "rem"),
  ...sizingHelper(20, 5, "rem"),
  ...sizingHelper(24, 6, "rem"),
  ...sizingHelper(28, 7, "rem"),
  ...sizingHelper(32, 8, "rem"),
  ...sizingHelper(36, 9, "rem"),
  ...sizingHelper(40, 10, "rem"),
  ...sizingHelper(44, 11, "rem"),
  ...sizingHelper(48, 12, "rem"),
  ...sizingHelper(52, 13, "rem"),
  ...sizingHelper(56, 14, "rem"),
  ...sizingHelper(60, 15, "rem"),
  ...sizingHelper(64, 16, "rem"),
  ...sizingHelper(72, 18, "rem"),
  ...sizingHelper(80, 20, "rem"),
  ...sizingHelper(96, 24, "rem"),
  ...sizeFractions("1/2"),
  ...sizeFractions("1/3"),
  ...sizeFractions("2/3"),
  ...sizeFractions("1/4"),
  ...sizeFractions("2/4"),
  ...sizeFractions("3/4"),
  ...sizeFractions("1/5"),
  ...sizeFractions("2/5"),
  ...sizeFractions("3/5"),
  ...sizeFractions("4/5"),
  ...sizeFractions("1/6"),
  ...sizeFractions("2/6"),
  ...sizeFractions("3/6"),
  ...sizeFractions("4/6"),
  ...sizeFractions("5/6"),
  ...sizeFractions("1/12"),
  ...sizeFractions("2/12"),
  ...sizeFractions("3/12"),
  ...sizeFractions("4/12"),
  ...sizeFractions("5/12"),
  ...sizeFractions("6/12"),
  ...sizeFractions("7/12"),
  ...sizeFractions("8/12"),
  ...sizeFractions("9/12"),
  ...sizeFractions("10/12"),
  ...sizeFractions("11/12"),
  ...generatePropertiesForColor("red"),
  ...generatePropertiesForColor("orange"),
  ...generatePropertiesForColor("yellow"),
  ...generatePropertiesForColor("green"),
  ...generatePropertiesForColor("blue"),
  ...generatePropertiesForColor("indigo"),
  ...generatePropertiesForColor("purple"),
  ...generatePropertiesForColor("pink"),
  ...generatePropertiesForColor("slate"),
  ...generatePropertiesForColor("gray"),

  "w-full": "width: 100%;",
  "h-full": "height: 100%;",
  "w-screen": "width: 100vw;",
  "h-screen": "height: 100vh;",
  "w-min": "width: min-content;",
  "h-min": "height: min-content;",
  "w-max": "width: max-content;",
  "h-max": "height: max-content;",
  "w-fit": "width: fit-content;",
  "h-fit": "height: fit-content;",
  "w-auto": "width: auto;",
  "h-auto": "height: auto;",
  "w-px": "width: 1px;",
  "h-px": "height: 1px;",
  "w-0": "width: 0;",
  "h-0": "height: 0;",

  // Display
  block: "display: block;",
  inline: "display: inline;",
  "inline-block": "display: inline-block;",
  grid: "display: grid;",
  "inline-grid": "display: inline-grid;",
  hidden: "display: none;",
  contents: "display: contents;",
  table: "display: table;",
  "table-caption": "display: table-caption;",
  "table-cell": "display: table-cell;",
  "table-column": "display: table-column;",
  "table-column-group": "display: table-column-group;",
  "table-footer-group": "display: table-footer-group;",
  "table-header-group": "display: table-header-group;",
  "table-row-group": "display: table-row-group;",
  "table-row": "display: table-row;",
  "flow-root": "display: flow-root;",
  "inline-table": "display: inline-table;",
  "list-item": "display: list-item;",
  "list-item-block": "display: list-item-block;",
  "list-item-inline": "display: list-item-inline;",
  "list-item-inline-block": "display: list-item-inline-block;",

  // Flexbox Utilities
  flex: "display: flex;",
  "inline-flex": "display: inline-flex;",
  "flex-row": "flex-direction: row;",
  "flex-row-reverse": "flex-direction: row-reverse;",
  "flex-col": "flex-direction: column;",
  "flex-col-reverse": "flex-direction: column-reverse;",

  "items-start": "align-items: flex-start;",
  "items-center": "align-items: center;",
  "items-end": "align-items: flex-end;",

  "justify-start": "justify-content: flex-start;",
  "justify-center": "justify-content: center;",
  "justify-end": "justify-content: flex-end;",

  // Grid Utilities
  "grid-cols-1": "grid-template-columns: repeat(1, minmax(0, 1fr));",
  "grid-cols-2": "grid-template-columns: repeat(2, minmax(0, 1fr));",
  "grid-cols-3": "grid-template-columns: repeat(3, minmax(0, 1fr));",
  "grid-cols-4": "grid-template-columns: repeat(4, minmax(0, 1fr));",

  // Text Utilities
  "text-left": textAlign("left"),
  "text-center": textAlign("center"),
  "text-right": textAlign("right"),

  "text-xs": fontSize("0.75rem"),
  "text-sm": fontSize("0.875rem"),
  "text-base": fontSize("1rem"),
  "text-lg": fontSize("1.125rem"),
  "text-xl": fontSize("1.25rem"),

  // Border Utilities
  border: border("1px", "solid", "black"),
  "border-t": "border-top: 1px solid;",
} as const;
