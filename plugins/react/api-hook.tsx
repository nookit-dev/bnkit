import { createContext, useContext, useMemo, useState } from "react";
import { FetchConfig, createFetchFactory } from "../..";
import { FetchFactoryConfig } from "./use-api-factory";
import { FetchDataConfigMap } from "./use-fetch-with-context";

const FetchContext = createContext<ReturnType<typeof createFetchFactory>>(
  createFetchFactory({
    baseUrl: "",
  })
);

export type FetcherConfig<
  ResponseType,
  BodyType = undefined,
  HeadersType = undefined,
  ParamsType = undefined
> = {
  request: {
    body?: BodyType;
    params?: ParamsType;
    headers?: HeadersType;
  };
  response: {
    data: ResponseType;
  };
};

export const FetchProvider = ({
  children,
  factoryConfig,
}: {
  children: React.ReactNode;
  factoryConfig: FetchFactoryConfig<FetchDataConfigMap>;
}) => {
  const fetchFactory = useMemo(() => createFetchFactory(factoryConfig), []);

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

export function createApiHook<ConfigMap extends FetchDataConfigMap>({
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
      throw new Error(`No configuration found for endpoint: ${endpointKey}`);
    }

    const { request, response } = endpointConfig;
    type DataT = typeof response.data;

    const [state, setState] = useState<FetchState<DataT>>({
      stage: "idle",
      data: null,
      retries: 0,
    });

    const fetchWithStateMachine = (
      config: ConfigMap[typeof endpointKey]["request"]
    ) => {
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

    return {
      get: (fetchConfig: FetchConfig<typeof request.params, {}>) =>
        fetchWithStateMachine(fetchConfig),
      data: state.data,
      // Include other properties/methods as needed
    };
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
