import type { Dispatchers } from "./create-web-socket-state-machine";

function isArrayType<T>(input: T | any[]): input is any[] {
  return Array.isArray(input);
}

function isObjectType(input: any): input is object {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function isNumberType(input: any): input is number {
  return typeof input === "number";
}

function createArrayDispatchers<Key, T>(
  key: Key,
  state: T[],
  updateFunction: (key: Key, value: T[]) => void
) {
  return {
    set: (value: T[]) => {
      console.log({
        set: "set",
        key,
        value,
        updateFunction
      });

      updateFunction(key, value);
    },
    push: (value: T) => {
      const existingState = state || [];
      const newArr = [...existingState, value];
      updateFunction(key, newArr);
    },
    pop: () => {
      const newArr = state.slice(0, -1);
      updateFunction(key, newArr);
    },
    insert: (index: number, value: T) => {
      const newArr = [...state];
      newArr.splice(index, 0, value);
      updateFunction(key, newArr);
    },
  };
}

function createObjectDispatchers<Key, T>(
  key: Key,
  state: T,
  updateFunction: (key: Key, value: any) => void
) {
  return {
    set: (value: T) => updateFunction(key, value),
    update: (value: Partial<T>) => {
      const newValue = { ...state, ...value };
      updateFunction(key, newValue);
    },
  };
}

function createNumberDispatchers<Key>(
  key: Key,
  state: number,
  updateFunction: (key: Key, value: any) => void
) {
  return {
    set: (value: number) => updateFunction(key, value),
    increment: (amount: number = 1) => {
      updateFunction(key, state + amount);
    },
    decrement: (amount: number = 1) => {
      updateFunction(key, state - amount);
    },
  };
}

function createDefaultDispatchers<Key, T>(
  key: Key,
  updateFunction: (key: Key, value: any) => void
) {
  return {
    set: (value: T) => updateFunction(key, value),
  };
}

function mergeWithDefault<State extends object>(
  defaultState: State,
  state: State
): State {
  const mergedState: Partial<State> = {};
  const missingKeys: (keyof State)[] = [];

  for (const key in defaultState) {
    if (key in state) {
      mergedState[key] = state[key];
    } else {
      mergedState[key] = defaultState[key];
      missingKeys.push(key);
    }
  }

  // Log missing keys
  if (missingKeys.length > 0) {
    console.info("Missing keys from state:", missingKeys.join(", "));
  }

  return mergedState as State;
}

export function createStateDispatchers<State extends object>({
  defaultState,
  state,
  updateFunction,
}: {
  state: State;
  defaultState: State;
  updateFunction: (key: keyof State, value: any) => void;
}): Dispatchers<State> {
  const mergedState = mergeWithDefault(defaultState, state);

  return (Object.keys(mergedState) as (keyof State)[]).reduce((acc, key) => {
    const k = key as keyof State;
    const currentValue = mergedState[k];

    if (isArrayType(currentValue)) {
      acc[k] = createArrayDispatchers(k, currentValue, updateFunction) as any;
    } else if (isObjectType(currentValue)) {
      acc[k] = createObjectDispatchers(k, currentValue, updateFunction) as any;
    } else if (isNumberType(currentValue)) {
      acc[k] = createNumberDispatchers(k, currentValue, updateFunction) as any;
    } else {
      acc[k] = createDefaultDispatchers(k, updateFunction) as any;
    }

    return acc;
  }, {} as Dispatchers<State>);
}
