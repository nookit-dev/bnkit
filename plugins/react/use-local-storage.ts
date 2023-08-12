import { Dispatch, useEffect, useState } from "react";

export type LocalStorageConfig<DataType> = {
  key: string; // LocalStorage key
  initialState: DataType; // Initial state if there's nothing in LocalStorage
};

export type LocalStorageReturnType<DataType> = [
  DataType,
  React.Dispatch<React.SetStateAction<DataType>>
];

export type GetLSKeyOptions = {
  fallbackToInitialValOnError?: boolean;
};

export type GetLSKeyFn<DataType> = (
  options: GetLSKeyOptions,
  onData?: (data: DataType) => void
) => DataType | null;
export type SetLSKeyFn<DataType> = (
  val: DataType | ((prevState: DataType) => DataType) 
) => void;
export type SyncLSKeyFn<DataType> = (
  fallbackToInitialVal: boolean
) => ReturnType<GetLSKeyFn<DataType>>;

export type UseLocalStorageReturn<DataType> = {
  get: GetLSKeyFn<DataType>;
  set: SetLSKeyFn<DataType>;
  state: DataType;
  setState: Dispatch<React.SetStateAction<DataType>>;
  sync: SyncLSKeyFn<DataType>;
  startSyncInterval: (syncConfig: SyncIntervalConfig) => void;
  stopSyncInterval: (syncConfig: SyncIntervalConfig) => void;
};

export type SyncIntervalConfig = {
  interval: number; // Time interval in milliseconds
};

export function useLocalStorage<DataType>(
  config: LocalStorageConfig<DataType>
): UseLocalStorageReturn<DataType> {
  // Initial state from local storage or fallback to initialState
  const getLSKey: GetLSKeyFn<DataType> = (options, onData) => {
    const { fallbackToInitialValOnError: fallbackToInitialValOnErrror = true } =
      options;

    const storedData = localStorage.getItem(config.key);

    try {
      const parsedData = JSON.parse(storedData || "") as DataType;

      if (onData) {
        onData(parsedData);
      }
      return parsedData;
    } catch (e) {
      console.error(
        "Failed to properly get Local Storage key/value, returning initial state",
        config.key,
        storedData,
        e
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
    let data: DataType | null = null;

    getLSKey(
      {
        fallbackToInitialValOnError: false,
      },
      (dataCb) => {
        data = dataCb;
      }
    );

    return data ?? config.initialState;
  };

  const [lsKeyState, setLsKeyState] = useState<DataType>(getInitState());
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
  const syncLSKeyState = (
    fallbackToInitialVal: boolean = false
  ): DataType | null => {
    return getLSKey(
      {
        fallbackToInitialValOnError: fallbackToInitialVal,
      },
      (data) => {
        setLsKeyState(data);
      }
    );
  };

  const setLSKey: SetLSKeyFn<DataType> = (value) => {
    let stringifiedVal = "";

    try {
      stringifiedVal = JSON.stringify(value);
    } catch (e) {
      console.error(
        "Failed to properly set Local Storage key/value",
        config.key,
        value,
        e
      );
    }

    try {
      localStorage.setItem(config.key, stringifiedVal);
      setLsKeyState(value);
    } catch (e) {
      console.error(
        "Failed to properly set Local Storage key/value",
        config.key,
        value,
        e
      );
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
      }
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
