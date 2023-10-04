export type FilteredKeys<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type ArrayTypesExtract<
  T extends ReadonlyArray<object>,
  K extends keyof T[number]
> = T[number][K];

export type IfFunction<T> = T extends (...args: any[]) => any
  ? ReturnType<T>
  : T;

// creates a union type of all the types in the array
export type UnboxArray<T extends Array<any>> = T extends Array<infer U>
  ? U
  : never;

// type that takes an object, an input type and an output type,
// and returns a type that has the same keys as the input type, but the values are of the output type,
// for example if you have an object with string values, and you want to transform them to numbers,
// you can use the transform type to do that
export type TransformValues<
  T extends object,
  FindT extends unknown,
  ReplaceT extends unknown
> = {
  [K in keyof T]: T[K] extends FindT ? ReplaceT : T[K];
};

export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};
