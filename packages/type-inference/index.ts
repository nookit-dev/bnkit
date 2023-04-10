



// Utility type to infer TypeScript types from the schema
export type InferType<T extends Record<string, keyof TypeMap>> = {
  [K in keyof T]: TypeMap[T[K]];
};

export type TypeMap = {
  string: string;
  number: number;
};

