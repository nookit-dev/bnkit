export type TypeMapping = {
  string: string
  number: number
  boolean: boolean
  date: Date
}

export type TypeMappingKeys = keyof TypeMapping

export type SchemaTInference<T extends Record<string, keyof TypeMapping>> = {
  [K in keyof T]: TypeMapping[T[K]]
}

export type ValidationResult<Schema extends object> = {
  error?: string
  data?: Schema[]
}

export type SchemaT = Record<string, keyof TypeMapping>

export type SetDispatch<Key, Options> = {
  set: (value: Key, options?: Options) => void
}

export type ArrayDispatch<T, Options> = {
  push: (value: T, options?: Options) => void
  pop: (options?: Options) => void
  insert: (index: number, value: T, options?: Options) => void
}

export type ObjectDispatch<Key, Options> = {
  update: (value: Partial<Key>, options?: Options) => void
}

export type NumberDispatch<Options> = {
  increment: (amount?: number, options?: Options) => void
  decrement: (amount?: number, options?: Options) => void
}

export type Dispatchers<State extends object, Options extends Object = {}> = {
  [Key in keyof State]: State[Key] extends (infer T)[]
    ? SetDispatch<State[Key], Options> & ArrayDispatch<T, Options>
    : State[Key] extends object
      ? SetDispatch<State[Key], Options> & ObjectDispatch<State[Key], Options>
      : State[Key] extends number
        ? SetDispatch<State[Key], Options> & NumberDispatch<Options>
        : SetDispatch<State[Key], Options>
}
