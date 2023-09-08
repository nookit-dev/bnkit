import { ServerWebSocket, WebSocketHandler } from "bun";
import { createStateDispatchers } from "./create-state-dispatchers";

type AllowedStateKeys = boolean | string | number;

type FilteredKeys<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type Dispatchers<State extends object, Options extends Object = {}> = {
  [Key in keyof State]: State[Key] extends (infer T)[]
    ? {
        set: (value: State[Key], options?: Options) => void;
        push: (value: T, options?: Options) => void;
        pop: (options?: Options) => void;
        insert: (index: number, value: T, options?: Options) => void;
      }
    : State[Key] extends object
    ? {
        set: (value: State[Key], options?: Options) => void;
        update: (value: Partial<State[Key]>, options?: Options) => void;
      }
    : State[Key] extends number
    ? {
        set: (value: State[Key], options?: Options) => void;
        increment: (amount?: number, options?: Options) => void;
        decrement: (amount?: number, options?: Options) => void;
      }
    : {
        set: (value: State[Key], options?: Options) => void;
      };
};

// TODO: state updated at timestamps to make sure an old client doesn't corrupt
// the state datas
export const createWSStateMachine = <State extends object>(
  initialState: State
) => {
  type UpdatedStateData<Key extends keyof State> = {
    key: Key;
    value: State[Key];
  };

  const connectedClients = new Set<ServerWebSocket>();

  let currentState: State = initialState;

  const stateChangeCallbacks: {
    [Key in keyof State]?: Array<(newValue: State[Key]) => void>;
  } = {};

  function onStateChange<Key extends keyof State>(
    key: Key,
    callback: (newValue: State[Key]) => void
  ) {
    if (!stateChangeCallbacks[key]) {
      stateChangeCallbacks[key] = [];
    }

    stateChangeCallbacks?.[key]?.push(callback);
  }

  const whenValueIs = <
    Key extends keyof State = FilteredKeys<State, AllowedStateKeys>,
    ExpectedVal extends State[Key] = State[Key]
  >(
    key: Key,
    expectedValue: ExpectedVal
  ) => {
    const value = currentState[key];

    return {
      then: (callback: () => void) => {
        if (value === expectedValue) {
          callback();
        } else {
          // If the current value isn't the expected value,
          // add a listener to run the callback once the value becomes the expected value
          onStateChange(
            key,
            (newValue: State[FilteredKeys<State, AllowedStateKeys>]) => {
              if (newValue === expectedValue) {
                callback();
                // Optionally, remove this listener after the callback has been triggered
                const index = stateChangeCallbacks?.[key]?.indexOf(callback);
                if (index && index > -1) {
                  stateChangeCallbacks?.[key]?.splice(index, 1);
                }
              }
            }
          );
        }
      },
    };
  };

  // Adding WebSocket handlers to the server for state sync
  const websocketHandler: WebSocketHandler = {
    open: (ws) => {
      // Add the newly connected client to the set
      connectedClients.add(ws);
    },
    close: (ws) => {
      // Remove the client from the set when they disconnect
      connectedClients.delete(ws);
    },
    message: (_ws, msg) => {
      if (typeof msg !== "string") return;

      const data: { key: keyof State; value: State[keyof State] } =
        JSON.parse(msg);

      if (data.key in currentState) {
        updateStateAndDispatch(data.key, data.value);
      }
    },
  };

  // The updater function
  function updateStateAndDispatch(
    key: keyof State,
    updater:
      | ((currentState: State[keyof State]) => State[keyof State])
      | State[keyof State]
  ) {
    const newValue =
      typeof updater === "function"
        ? (updater as (currentState: State[keyof State]) => State[keyof State])(
            currentState[key]
          )
        : updater;
    currentState[key] = newValue;

    stateChangeCallbacks[key]?.forEach((callback) => callback(newValue));

    const updatedStateData: UpdatedStateData<typeof key> = {
      key: key,
      value: newValue,
    };

    for (const client of connectedClients) {
      client.send(JSON.stringify(updatedStateData));
    }
  }

  const dispatchers = createStateDispatchers(
    {
      defaultState: initialState,
      state: currentState,
      updateFunction: updateStateAndDispatch,
    }
  );

  return {
    updateStateAndDispatch,
    websocketHandler,
    connectedClients,
    state: currentState,
    control: dispatchers,
    onStateChange,
    whenValueIs,
  };
};
