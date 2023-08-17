import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { FetchConfig, createFetchFactory } from "../..";
import { FetchFactoryConfig } from "./use-api-factory";

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

export type FetchDataConfigMap = Record<string, FetcherConfig<any, any, any>>;

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

export function useEndpointFetcher<ConfigMap extends FetchDataConfigMap>(
  endpointKey: keyof ConfigMap,
  configMap: ConfigMap
) {
  const { get, post, ...rest } = useFetchFactory(); // Use the fetch factory from context

  const endpointConfig = configMap[endpointKey];
  if (!endpointConfig) {
    throw new Error(
      `No configuration found for endpoint: ${endpointKey as string}`
    );
  }

  const { request, response } = endpointConfig;

  type DataT = typeof response.data;

  const [state, setState] = useState<FetchState<DataT>>({
    stage: "idle",
    data: null,
    retries: 0,
  });

  const fetchWithStateMachine = (config: FetchConfig<undefined, {}>) => {
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

  useEffect(() => {
    if (
      state.stage === "idle" ||
      (state.stage === "rejected" && state.retries <= 3)
    ) {
      // TODO: Modify the endpoint configuration accordingly
      fetchWithStateMachine({ endpoint: "/example-endpoint" });
    }
  }, [state]);

  return {
    state,
    fetch: get, // or post, or whichever method you need based on your configuration
    ...rest,
  };
}
