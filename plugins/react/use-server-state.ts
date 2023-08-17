import { useEffect, useRef, useState } from "react";
import { Dispatchers } from "server-factory/create-web-socket-state-machine";
import { createStateDispatchers } from "../../modules/server-factory/create-state-dispatchers";

const getAppStateFromLocalStorage = <State extends object>(
  defaultState: State
): State => {
  const appStateString = localStorage.getItem("appState");

  try {
    return appStateString ? JSON.parse(appStateString) : defaultState;
  } catch (error) {
    return defaultState;
  }
};

export function useServerState<State extends object>({
  defaultState,
  url,
}: {
  url: string;
  defaultState: State;
}): {
  state: State;
  control: Dispatchers<State>;
} {
  const [state, setState] = useState<State>(() =>
    getAppStateFromLocalStorage(defaultState)
  );
  const wsRef = useRef<WebSocket | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const websocket = new WebSocket(url);
    wsRef.current = websocket;

    websocket.onmessage = (event) => {
      if (typeof event.data !== "string") return;
      const newState: State = JSON.parse(event.data);
      setState(newState);
    };

    return () => {
      websocket.close();
    };
  }, [url]);

  useEffect(() => {
    const storedState = getAppStateFromLocalStorage<State>(defaultState);

    if (!initialized.current) {
      setState(storedState);
      initialized.current = true;
      return;
    }
  }, []);

  useEffect(() => {
    if (initialized.current) {
      localStorage.setItem("appState", JSON.stringify(state));
    }
  }, [state]);

  const dispatch = (key: keyof State, value: State[keyof State]) => {
    if (wsRef.current) {
      wsRef.current?.send(JSON.stringify({ key, value }));
    }
  };

  // const createKeyDispatcher = <StateKey extends keyof State>(key: StateKey) => {
  //   return (value: State[StateKey]) => {
  //     dispatch(key, value)
  //   };
  // };

  // const setters: Dispatchers<State> = (
  //   Object.keys(defaultState) as (keyof State)[]
  // ).reduce((acc, key) => {
  //   const k = key as keyof State;
  //   if (Array.isArray(state[k])) {
  //     const currentArray = state[k] as any[];
  //     acc[k] = {
  //       set: (value: State[keyof State]) => dispatch({ key: k, value }),
  //       push: (value: any) => {
  //         dispatch({
  //           key: k,
  //           value: [...currentArray, value] as State[keyof State],
  //         });
  //       },
  //       pop: () => {
  //         const newArr = currentArray.slice(0, -1);
  //         dispatch({ key: k, value: newArr as State[keyof State] });
  //       },
  //       insert: (index: number, value: any) => {
  //         const newArr = [...currentArray];
  //         newArr.splice(index, 0, value);
  //         dispatch({ key: k, value: newArr as State[keyof State] });
  //       },
  //     } as Dispatchers<State>[keyof State];
  //   } else if (typeof state[k] === "object" && state[k] !== null) {
  //     acc[k] = {
  //       set: (value: State[keyof State]) => dispatch({ key: k, value }),
  //       update: (value: Partial<State[keyof State]>) => {
  //         const newValue = { ...state[k], ...value };
  //         dispatch({ key: k, value: newValue });
  //       },
  //     } as Dispatchers<State>[keyof State];
  //   } else if (typeof state[k] === "number") {
  //     const currentValue = state[k] as number;
  //     acc[k] = {
  //       set: (value: State[keyof State]) => dispatch({ key: k, value }),
  //       increment: (amount: number = 1) => {
  //         dispatch({
  //           key: k,
  //           value: (currentValue + amount) as State[keyof State],
  //         });
  //       },
  //       decrement: (amount: number = 1) => {
  //         dispatch({
  //           key: k,
  //           value: (currentValue - amount) as State[keyof State],
  //         });
  //       },
  //     } as Dispatchers<State>[keyof State];
  //   } else {
  //     acc[k] = {
  //       set: (value: State[keyof State]) => dispatch({ key: k, value }),
  //     } as Dispatchers<State>[keyof State];
  //   }
  //   return acc;
  // }, {} as Dispatchers<State>);

  const control = createStateDispatchers<State>(
    { ...defaultState, ...state },
    dispatch
  ) as Dispatchers<State>;

  return {
    state,
    // createKeyDispatcher,
    // dispatch,
    control,
  } as {
    state: State;
    control: ReturnType<typeof createStateDispatchers<State>>;
  };
}

const test = createStateDispatchers<{ count: number }>(
  {
    count: 0,
  },
  (dispatch) => {}
);
