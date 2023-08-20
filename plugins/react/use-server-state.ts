import { createStateDispatchers } from "@u-tools/core/modules/server-factory/create-state-dispatchers";
import { Dispatchers } from "@u-tools/core/modules/server-factory/create-web-socket-state-machine";
import { useEffect, useRef, useState } from "react";

const MAX_RETRIES = 5;

const getAppStateFromLocalStorage = <State extends object>(
  defaultState: State
): State => {
  const appStateString = localStorage.getItem("appState");

  try {
    const storedState = appStateString ? JSON.parse(appStateString) : {};
    // Merge the default state with the stored state.
    // This will ensure that missing keys in storedState will be taken from defaultState.
    return { ...defaultState, ...storedState };
  } catch (error) {
    return defaultState;
  }
};

type OptimisticMap<State> = Partial<Record<keyof State, boolean>>;

export type DefaultOptions = {
  optimistic?: boolean;
};

export function useServerState<
  State extends object,
  Options extends DefaultOptions = {}
>({
  defaultState,
  url,
  optimisticMap,
}: {
  url: string;
  defaultState: State;
  optimisticMap?: OptimisticMap<State>;
}): {
  state: State;
  control: Dispatchers<State, Options>;
  dispatch: (
    key: keyof State,
    value: State[keyof State],
    opts?: Options
  ) => void;
} {
  const [state, setState] = useState<State>(() =>
    getAppStateFromLocalStorage(defaultState)
  );
  const wsRef = useRef<WebSocket | null>(null);
  const initialized = useRef(false);
  const prevStateRef = useRef<State | null>(null);
  const retryCount = useRef(0);

  useEffect(() => {
    const connectToServer = () => {
      const websocket = new WebSocket(url);
      wsRef.current = websocket;

      websocket.onopen = () => {
        retryCount.current = 0;
      };

      websocket.onmessage = (event) => {
        if (typeof event.data !== "string") return;
        const receivedData = JSON.parse(event.data);

        if (receivedData.status === "failure" && prevStateRef.current) {
          setState(prevStateRef.current);
        } else if (receivedData.key && "value" in receivedData) {
          setState((prevState) => ({
            ...prevState,
            [receivedData.key]: receivedData.value,
          }));
        }
      };

      websocket.onclose = (event) => {
        // Check if the WebSocket was closed unexpectedly and we haven't exceeded max retries
        if (event.code !== 1000 && retryCount.current < MAX_RETRIES) {
          retryCount.current += 1;
          const delay = Math.min(1000 * retryCount.current, 30000);
          setTimeout(connectToServer, delay);
        } else {
          retryCount.current = 0; // Reset retry count if we've reached max retries or if closure was normal
        }
      };

      return () => {
        websocket?.close?.();
      };
    };

    connectToServer();

    // Clean up function
    return () => {
      wsRef.current?.close();
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
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ key, value }));
    }
  };

  const dispatch = (
    key: keyof State,
    value: State[keyof State],
    opts?: Options
  ) => {
    const isOptimistic = opts?.optimistic ?? optimisticMap?.[key] !== false;

    if (isOptimistic) {
      prevStateRef.current = state;
      setState((prev) => ({ ...prev, [key]: value }));
    }

    sendToServer(key, value);
  };

  const control = createStateDispatchers<State, Options>({
    defaultState,
    state,
    updateFunction: dispatch,
  });

  return {
    state,
    control,
    dispatch,
  };
}
