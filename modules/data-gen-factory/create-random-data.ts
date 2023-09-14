import { getRandomCity } from "./cities";
import { getRandomCountry } from "./countries";
import {
    getRandomFirstName,
    getRandomFullName,
    getRandomLastName,
} from "./names";
import { randNum } from "./rand-num";
import { getRandState } from "./states";
type NumConfig = {
  type: "num";
  min?: number;
  max?: number;
};

type OtherConfig = {
  type: Exclude<keyof DataGeneratorsMap, "num">;
};

type OutputType<T extends DataConfigItem> = T extends { type: "num" }
  ? number
  : ReturnType<DataGeneratorsMap[T["type"]]>;

type DataConfigItem = NumConfig | OtherConfig;

export const dataGeneratorMap = {
  city: getRandomCity,
  firstName: getRandomFirstName,
  lastName: getRandomLastName,
  fullName: getRandomFullName,
  country: getRandomCountry,
  state: getRandState,
  num: randNum,
};

export type DataGeneratorMapConfig = {
  city: {};
  firstName: {};
  lastName: {};
  fullName: {};
  country: {};
  state: {};
  num: { min: number; max: number };
};

type DataGeneratorsMap = typeof dataGeneratorMap;

export function createRandomData<T extends Record<string, DataConfigItem>>(
  config: T
): { [K in keyof T]: OutputType<T[K]> } {
  const result: any = {};

  for (const key in config) {
    const itemConfig = config[key];
    if (itemConfig.type === "num") {
      const { min = 0, max = 100 } = itemConfig;
      result[key] = dataGeneratorMap[itemConfig.type](min, max);
    } else {
      result[key] = dataGeneratorMap[itemConfig.type]();
    }
  }

  return result;
}

const dataGen = {
  first: { type: "firstName" }, // Explicitly type this as OtherConfig
  age: { type: "num", min: 18, max: 65 }, // Explicitly type this as NumConfig
} as const;

const randomData = createRandomData(dataGen);
console.log(randomData);
