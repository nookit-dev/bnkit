import { ServerWebSocket, WebSocketHandler } from "bun";
import { createStateDispatchers } from "./create-state-dispatchers";

export type Dispatchers<State extends object> = {
  [Key in keyof State]: State[Key] extends (infer T)[]
    ? {
        set: (value: State[Key]) => void;
        push: (value: T) => void;
        pop: () => void;
        insert: (index: number, value: T) => void;
      }
    : State[Key] extends object
    ? {
        set: (value: State[Key]) => void;
        update: (value: Partial<State[Key]>) => void;
      }
    : State[Key] extends number
    ? {
        set: (value: State[Key]) => void;
        increment: (amount?: number) => void;
        decrement: (amount?: number) => void;
      }
    : {
        set: (value: State[Key]) => void;
      };
};

// TODO: state updated at timestamps to make sure an old client doesn't corrupt
// the state datas
export const createWSStateMachine = <State extends object>(
  initialState: State
) => {
  const connectedClients = new Set<ServerWebSocket>();

  let currentState: State = initialState;

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
    message: (ws, msg) => {
      // Your message handling logic here
      // This part may be more complex based on your state shape and update requirements

      console.log({
        msg,
      });

      if (typeof msg !== "string") return;
      const data: { key: keyof State; value: State[keyof State] } =
        JSON.parse(msg);

      console.log({
        data,
      });

      if (data.key in currentState) {
        console.log("Before update:", currentState[data.key]);

        // Ensure the key exists in the current state
        currentState[data.key] = data.value;

        console.log("After update:", currentState[data.key]);

        // Broadcast the updated state to all connected clients
        for (const client of connectedClients) {
          client.send(JSON.stringify(currentState));
        }
      }
    },
  };

  // The updater function
  function updateStateAndDispatch(
    key: keyof State,
    updater: (currentState: State[keyof State]) => State[keyof State]
  ) {
    const newValue = updater(currentState[key]);
    currentState[key] = newValue;

    // Broadcast the updated state to all connected clients
    for (const client of connectedClients) {
      client.send(JSON.stringify(currentState));
    }
  }

  const dispatchers = createStateDispatchers(
    initialState,
    updateStateAndDispatch
  );

  return {
    updateStateAndDispatch,
    websocketHandler,
    connectedClients,
    state: currentState,
    control: dispatchers,
  };
};
