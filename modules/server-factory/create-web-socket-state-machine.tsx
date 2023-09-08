import { ServerWebSocket, WebSocketHandler } from "bun";
import { createStateDispatchers } from "./create-state-dispatchers";
import { FilteredKeys } from "../type-utils";

export type AllowedStateKeys = boolean | string | number;

type DispatchOp<State> = {
  set: (value: State) => void;
};

type ArrayOp<Value> = DispatchOp<Value[]> & {
  push: (value: Value) => void;
  pop: () => void;
  insert: (index: number, value: Value) => void;
};

type ObjectOp<State> = DispatchOp<State> & {
  update: (value: Partial<State>) => void;
};

type NumberOp = DispatchOp<number> & {
  increment: (amount?: number) => void;
  decrement: (amount?: number) => void;
};

type DispatcherItem<State> = State extends any[]
  ? ArrayOp<Extract<State, any[]>[number]>
  : State extends object
  ? ObjectOp<State>
  : State extends number
  ? NumberOp
  : DispatchOp<State>;

export type Dispatchers<State> = {
  [Key in keyof State]: DispatcherItem<State[Key]>;
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
    (stateChangeCallbacks[key] ??= []).push(callback);
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
        if (value === expectedValue) callback();
        else {
          onStateChange(key, (newValue) => {
            if (newValue === expectedValue) {
              callback();
              stateChangeCallbacks[key] = stateChangeCallbacks[key]?.filter(
                (c) => c !== callback
              );
            }
          });
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

  const dispatchers = createStateDispatchers({
    defaultState: initialState,
    state: currentState,
    updateFunction: updateStateAndDispatch,
  });

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
