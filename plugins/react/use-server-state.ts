import { useEffect, useRef, useState } from "react";
import {
  DispatcherOpts,
  createStateDispatchers,
} from "../../modules/server-factory/create-state-dispatchers";
import { Dispatchers } from "../../modules/server-factory/create-web-socket-state-machine";

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

type OptimisticMap<State> = Partial<Record<keyof State, boolean>>;

export function useServerState<State extends object>({
  defaultState,
  url,
  debounceMap,
  optimisticMap,
}: {
  url: string;
  defaultState: State;
  debounceMap?: Partial<Record<keyof State, number>>; // A map of state keys to debounce durations
  optimisticMap?: OptimisticMap<State>;
}): {
  state: State;
  control: Dispatchers<
    State,
    {
      debounce: number;
      optimistic: boolean;
    }
  >;
} {
  const [state, setState] = useState<State>(() =>
    getAppStateFromLocalStorage(defaultState)
  );
  const wsRef = useRef<WebSocket | null>(null);
  const initialized = useRef(false);
  const prevStateRef = useRef<State | null>(null);

  useEffect(() => {
    const websocket = new WebSocket(url);
    wsRef.current = websocket;

    websocket.onmessage = (event) => {
      if (typeof event.data !== "string") return;
      const { status } = JSON.parse(event.data);

      // If the server returns a failure status, revert the state.
      if (status === "failure" && prevStateRef.current) {
        setState(prevStateRef.current);
      }
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

  const sendToServer = (key: keyof State, value: State[keyof State]) => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ key, value }));
    }
  };

  const debounceSendToServer = (
    key: keyof State,
    value: State[keyof State]
  ) => {
    const debounceDuration = debounceMap?.[key];
    if (debounceDuration) {
      debounce(sendToServer, debounceDuration)(key, value);
    } else {
      sendToServer(key, value);
    }
  };

  const dispatch = (
    key: keyof State,
    value: State[keyof State],
    opts?: DispatcherOpts
  ) => {
    const isOptimistic =
      opts?.optimisticUpdate ?? optimisticMap?.[key] !== false;

    if (isOptimistic) {
      prevStateRef.current = state;
      setState((prev) => ({ ...prev, [key]: value }));
    }

    debounceSendToServer(key, value);
  };

  const control = createStateDispatchers<State>({
    defaultState,
    state,
    updateFunction: dispatch,
  });

  return {
    state,
    control,
  };
}
