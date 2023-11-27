import { Dispatch, useEffect, useState } from "react";

export type LocalStoreConfig<DataT> = {
  key: string; // LocalStorage key
  initialState: DataT; // Initial state if there's nothing in LocalStorage
};

export type LocalStoreReturnT<DataT> = [DataT, React.Dispatch<React.SetStateAction<DataT>>];

export type GetLSKeyOptions = {
  fallbackToInitialValOnError?: boolean;
};

export type GetLSKeyFn<DataT> = (options: GetLSKeyOptions, onData?: (data: DataT) => void) => DataT | null;

export type SetLSKeyFn<DataT> = (val: DataT | ((prevState: DataT) => DataT)) => void;

export type SyncLSKeyFn<DataT> = (fallbackToInitialVal: boolean) => ReturnType<GetLSKeyFn<DataT>>;

export type UseLocalStorageReturn<DataT> = {
  get: GetLSKeyFn<DataT>;
  set: SetLSKeyFn<DataT>;
  state: DataT;
  setState: Dispatch<React.SetStateAction<DataT>>;
  sync: SyncLSKeyFn<DataT>;
  startSyncInterval: (syncConfig: SyncIntervalConfig) => void;
  stopSyncInterval: (syncConfig: SyncIntervalConfig) => void;
};

export type SyncIntervalConfig = {
  interval: number; // Time interval in milliseconds
};

export function useLocalStorage<DataT>(config: LocalStoreConfig<DataT>): UseLocalStorageReturn<DataT> {
  // Initial state from local storage or fallback to initialState
  const getLSKey: GetLSKeyFn<DataT> = (options, onData) => {
    const { fallbackToInitialValOnError: fallbackToInitialValOnErrror = true } = options;

    const storedData = localStorage.getItem(config.key);

    try {
      const parsedData = JSON.parse(storedData || "") as DataT;

      if (onData) {
        onData(parsedData);
      }
      return parsedData;
    } catch (e) {
      console.error(
        "Failed to properly get Local Storage key/value, returning initial state",
        config.key,
        storedData,
        e,
      );

      if (fallbackToInitialValOnErrror) {
        if (onData) {
          onData(config.initialState);
        }
        return config.initialState;
      }
      return null;
    }
  };

  const getInitState = () => {
    let data: DataT | null = null;

    getLSKey(
      {
        fallbackToInitialValOnError: false,
      },
      (dataCb) => {
        data = dataCb;
      },
    );

    return data ?? config.initialState;
  };

  const [lsKeyState, setLsKeyState] = useState<DataT>(getInitState());
  const [syncIntervalId, setSyncIntervalId] = useState<number | null>(null);

  const startSyncInterval = (syncConfig: SyncIntervalConfig) => {
    // Clear any existing interval
    if (syncIntervalId) {
      clearInterval(syncIntervalId);
    }

    if (typeof window !== "undefined") {
      // Set up the new interval
      const id = window?.setInterval(() => {
        syncLSKeyState(true); // Assuming you want to fallback to initial value during auto-sync
      }, syncConfig.interval);

      setSyncIntervalId(id);
    }
  };

  const stopSyncInterval = () => {
    if (syncIntervalId) {
      clearInterval(syncIntervalId);
    }
  };

  useEffect(() => {
    return () => stopSyncInterval();
  }, [syncIntervalId]);

  // syncs the state to local storage
  const syncLSKeyState = (fallbackToInitialVal: boolean = false): DataT | null => {
    return getLSKey(
      {
        fallbackToInitialValOnError: fallbackToInitialVal,
      },
      (data) => {
        setLsKeyState(data);
      },
    );
  };

  const setLSKey: SetLSKeyFn<DataT> = (value) => {
    let stringifiedVal = "";

    try {
      stringifiedVal = JSON.stringify(value);
    } catch (e) {
      console.error("Failed to properly set Local Storage key/value", config.key, value, e);
    }

    try {
      localStorage.setItem(config.key, stringifiedVal);
      setLsKeyState(value);
    } catch (e) {
      console.error("Failed to properly set Local Storage key/value", config.key, value, e);
    }
  };

  // Whenever key changes, update local storage
  useEffect(() => {
    getLSKey(
      {
        fallbackToInitialValOnError: true,
      },
      (data) => {
        setLsKeyState(data);
      },
    );
  }, [config.key]);

  return {
    set: setLSKey,
    get: getLSKey,
    state: lsKeyState,
    // set state directly, this is needed incase you need direct access to prevState for example
    setState: setLsKeyState,
    sync: syncLSKeyState,
    startSyncInterval,
    stopSyncInterval,
  };
}
