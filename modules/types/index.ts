// Utility type to infer TypeScript types from the schema
export type TypeInference<T extends Record<string, keyof TypeMapping>> = {
  [K in keyof T]: TypeMapping[T[K]];
};

export type TypeMapping = {
  string: string;
  number: number;
};
