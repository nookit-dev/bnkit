import { useEffect, useState } from "react";

export type LocalStorageConfig<DataType> = {
  key: string; // LocalStorage key
  initialState: DataType; // Initial state if there's nothing in LocalStorage
};

export type LocalStorageReturnType<DataType> = [
  DataType,
  React.Dispatch<React.SetStateAction<DataType>>
];

export type GetLSKeyOptions = {
  updateHookStateWithLSVal?: boolean;
  fallbackToInitialValOnErrror?: boolean;
};

export type GetLSKeyFn<DataType> = (
  options: GetLSKeyOptions
) => DataType | undefined;
export type SetLSKeyFn<DataType> = (val: DataType) => void;
export type SyncLSKeyFn<DataType> = (
  fallbackToInitialVal: boolean
) => ReturnType<GetLSKeyFn<DataType>>;

export type UseLocalStorageReturn<DataType> = {
  get: GetLSKeyFn<DataType>;
  set: SetLSKeyFn<DataType>;
  state: DataType;
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
  const [lsKeyState, setLsKeyState] = useState<DataType>(
    () =>
      getLSKey({
        updateHookStateWithLSVal: false,
        fallbackToInitialValOnErrror: false,
      }) || config.initialState
  );
  const [syncIntervalId, setSyncIntervalId] = useState<number | null>(null);

  const startSyncInterval = (syncConfig: SyncIntervalConfig) => {
    // Clear any existing interval
    if (syncIntervalId) {
      clearInterval(syncIntervalId);
    }

    // Set up the new interval
    const id = window.setInterval(() => {
      syncLSKeyState(true); // Assuming you want to fallback to initial value during auto-sync
    }, syncConfig.interval);

    setSyncIntervalId(id);
  };

  const stopSyncInterval = () => {
    if (syncIntervalId) {
      clearInterval(syncIntervalId);
    }
  };

  useEffect(() => {
    return () => stopSyncInterval();
  }, [syncIntervalId]);

  // Initial state from local storage or fallback to initialState
  const getLSKey: GetLSKeyFn<DataType> = (options) => {
    const {
      updateHookStateWithLSVal = false,
      fallbackToInitialValOnErrror = true,
    } = options;

    const storedData = localStorage.getItem(config.key);

    try {
      const parsedData = JSON.parse(storedData) as DataType;

      if (updateHookStateWithLSVal) {
        setLsKeyState(parsedData);
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
        if (updateHookStateWithLSVal) {
          setLsKeyState(config.initialState);
        }
        return config.initialState;
      }
      return undefined;
    }
  };

  // syncs the state to local storage
  const syncLSKeyState = (
    fallbackToInitialVal: boolean = false
  ): DataType | undefined => {
    return getLSKey({
      fallbackToInitialValOnErrror: fallbackToInitialVal,
      updateHookStateWithLSVal: true,
    });
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
    getLSKey({
      fallbackToInitialValOnErrror: true,
      updateHookStateWithLSVal: true,
    });
  }, [config.key]);

  return {
    set: setLSKey,
    get: getLSKey,
    state: lsKeyState,
    sync: syncLSKeyState,
    startSyncInterval,
    stopSyncInterval,
  };
}
