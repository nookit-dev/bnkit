export type Option = {
  value: string;
  label: string;
};


// ControlTypes.ts
export interface BaseControlConfig {
  type: string;
  id: string;
  name: string;
  defaultValue: string | number;
}

export interface SliderControlConfig extends BaseControlConfig {
  type: "slider";
  min: number;
  max: number;
}

export interface SelectControlConfig extends BaseControlConfig {
  type: "dropdown";
  options: Option[];
}

export interface ColorControlConfig extends BaseControlConfig {
  type: "color";
}

export type ControlConfig =
  | SliderControlConfig
  | SelectControlConfig
  | ColorControlConfig;

