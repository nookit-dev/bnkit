// Type Check Helper
export type TypeCheck<T, U> = T extends U ? true : never;
export function typeCheck<T extends true>() {}
