import {
  TypeMap,
  createFetchFactory,
} from "@u-tools/core/modules/fetch-factory";
import React, { ReactNode, createContext, useContext, useMemo, useState } from "react";
// TODO: This hook needs some more work
type FetchFactoryReturn<ConfigMap extends TypeMap = {}> = ReturnType<
  typeof createFetchFactory<ConfigMap>
>;

const FetchContext = createContext<FetchFactoryReturn>(
  createFetchFactory({
    baseUrl: "",
    config: {
      "/test": {
        endpoint: "/test",
        method: "GET",
      },
    },
  })
);

export const FetchProvider = <FetchConfig extends TypeMap>({
  children,
  factoryConfig,
}: {
  children: ReactNode;
  factoryConfig: FetchConfig;
}) => {
  const fetchFactory = useMemo(
    () =>
      createFetchFactory({
        config: factoryConfig,
      }),
    []
  );

  return (
    <FetchContext.Provider value={fetchFactory}>
      {children}
    </FetchContext.Provider>
  );
};

export function useFetchFactory() {
  const fetchFactory = useContext(FetchContext);

  if (!fetchFactory) {
    throw new Error("useFetchFactory must be used within a FetchProvider");
  }

  return fetchFactory;
}

type FetchState<DataT> =
  | { stage: "idle"; data: null; retries: 0 }
  | { stage: "fetching"; data: null; retries: number }
  | { stage: "resolved"; data: DataT; retries: number }
  | { stage: "rejected"; data: null; retries: number };

export function createApiHook<ConfigMap extends TypeMap>({
  configMap,
  baseUrl,
}: {
  configMap: ConfigMap;
  baseUrl: string;
}) {
  return function useCustomApi(endpointKey: keyof ConfigMap) {
    const { get, post, ...rest } = useFetchFactory();
    const endpointConfig = configMap[endpointKey];

    if (!endpointConfig) {
      throw new Error(
        `No configuration found for endpoint: ${
          configMap[typeof endpointKey].endpoint
        }`
      );
    }

    const { response } = endpointConfig;
    type DataT = typeof response.data;

    const [state, setState] = useState<FetchState<DataT>>({
      stage: "idle",
      data: null,
      retries: 0,
    });

    const fetchWithStateMachine = (config: ConfigMap[typeof endpointKey]) => {
      switch (state.stage) {
        case "idle":
          setState((prev) => ({
            ...prev,
            stage: "fetching",
            data: null,
            retries: prev.retries,
          }));
          break;
        case "fetching":
          // TODO ensure the request config in the config map matches what the get request expects
          get(config)
            .then((data) => {
              setState({ stage: "resolved", data, retries: state.retries });
            })
            .catch(() => {
              setState((prev) => ({
                stage: "rejected",
                data: null,
                retries: prev.retries + 1,
              }));
            });
          break;
        case "rejected":
          if (state.retries <= 3) {
            setState((prev) => ({
              ...prev,
              stage: "fetching",
              data: null,
              retries: prev.retries,
            }));
          }
          break;
        default:
          break;
      }
    };

    // return {
    //   get: (fetchConfig: APIConfig<typeof request.params, {}>) =>
    //     fetchWithStateMachine(fetchConfig),
    //   data: state.data,
    //   // Include other properties/methods as needed
    // };
  };
}

// Now you can use this to create custom hooks tailored for specific APIs

// Example usage:
// const useMyCustomApi = createApiHook<MyAPIConfigMap>({ baseUrl: 'http://localhost:3000' });

// const {
//   response: { data },
//   get,
//   post,
//   ...rest
// } = useCustomApi("/get-users");
