import * as React from "react";
import { hydrateRoot } from "react-dom/client";

export const appState = {
  count: 0,
};

setInterval(() => {
  console.log(appState);
}, 1000);

export type AppStateT = typeof appState;

export const Base = ({
  children,
  entryFilePath,
}: {
  children?: React.ReactNode;
  entryFilePath: string;
}) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />

        <link rel="icon" href="favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Web site created using U Toolkit" />
        <link rel="apple-touch-icon" href="/logo192.png" />

        <link rel="manifest" href="/manifest.json" />

        <title>React App</title>

        <script type="module" src={entryFilePath}></script>
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root">{children}</div>
      </body>
    </html>
  );
};

export type ContextStateT<StateT extends object = {}> = {
  state: StateT;
  updateKey: <Key extends keyof StateT = keyof StateT>(
    key: Key,
    value: StateT[Key]
  ) => void;
};

export type ReactContextT<StateT extends object = {}> = React.Context<
  ContextStateT<StateT>
>;

const isServer = () => {
  return typeof window === "undefined";
};

const initState = async <StateT extends object>() => {
  const isServerSide = isServer();

  if (isServerSide) {
    return {
      ...appState,
    };
  }

  const res = await fetch("/state", {
    method: "GET",
  });

  const json = await res.json();

  return json as StateT;
};

const AppContext = React.createContext<{
  state: typeof appState;
  updateKey: <Key extends keyof typeof appState = keyof typeof appState>(
    key: Key,
    value: (typeof appState)[Key]
  ) => void;
}>({
  state: { count: 0 },
  updateKey: () => {},
});

const clientToServerStateKeyUpdate = async <
  StateT extends object,
  Key extends keyof StateT = keyof StateT
>(
  key: Key,
  value: StateT[Key]
) => {
  const res = await fetch("/state", {
    method: "POST",
    body: JSON.stringify({
      type: "partial",
      state: {
        [key]: value,
      },
    }),
  });
  const json = await res.json();
  console.log({ json });
  return json;
};

export const StateProvider = <StateT extends typeof appState>({
  children,
  defaultState,
}: {
  children: React.ReactNode;
  defaultState?: StateT;
}) => {
  const [state, setState] = React.useState<StateT>(
    () => (defaultState || {}) as StateT
  );

  React.useEffect(() => {
    initState().then((state) => {
      setState((prev) => ({
        ...prev,
        ...state,
      }));
    });
  }, []);

  const isServerSide = isServer();

  const updateKey = async <Key extends keyof StateT = keyof StateT>(
    key: Key,
    value: StateT[Key]
  ) => {
    console.log({ key, value });
    if (isServerSide) return null;

    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
    clientToServerStateKeyUpdate<StateT>(key, value);
  };

  return (
    <AppContext.Provider value={{ state, updateKey }}>
      {children}
    </AppContext.Provider>
  );
};

const useClientAppState = () => {
  const { state, updateKey } = React.useContext(AppContext);

  return {
    state,
    updateKey,
  };
};

const Counter = () => {
  const { state, updateKey } = useClientAppState();

  console.log({ state, updateKey });

  return (
    <div>
      <div>Count: {state.count}</div>
      <button onClick={() => updateKey("count", (state.count || 0) + 1)}>
        Increment
      </button>
    </div>
  );
};

export const getAppState = () => {
  return { ...appState };
};

export const AppEntry = <StateT extends typeof appState>({
  defaultState,
}: {
  defaultState: StateT;
}) => {
  return (
    <StateProvider defaultState={defaultState}>
      <Counter />
    </StateProvider>
  );
};

if (typeof window !== "undefined") {
  const root =
    typeof document !== "undefined" && document.getElementById("root");

  if (!root) {
    console.error("Root node not found");
    throw new Error("Root node not found");
  }

  hydrateRoot(
    root,
    <React.StrictMode>
      <AppEntry defaultState={{ ...getAppState() }} />
    </React.StrictMode>
  );
}
