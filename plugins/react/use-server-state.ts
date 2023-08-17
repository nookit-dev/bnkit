import { useEffect, useRef, useState } from "react";
import { createStateDispatchers } from "../../modules/server-factory/create-state-dispatchers";
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
    console.log({
      key,
      value,
    });
    if (wsRef.current) {
      wsRef.current?.send(JSON.stringify({ key, value }));
    }
  };

  const control = createStateDispatchers<State>({
    defaultState,
    state,
    updateFunction: dispatch,
  });

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
