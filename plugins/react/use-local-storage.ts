import { useEffect, useState } from "react";

type LocalStorageConfig<DataType> = {
  key: string; // LocalStorage key
  initialState: DataType; // Initial state if there's nothing in LocalStorage
};

export type LocalStorageReturnType<DataType> = [
  DataType,
  React.Dispatch<React.SetStateAction<DataType>>
];

export function useLocalStorage<DataType>(
  config: LocalStorageConfig<DataType>
): LocalStorageReturnType<DataType> {
  // Initial state from local storage or fallback to initialState
  const getInitialData = (): DataType => {
    const storedData = localStorage.getItem(config.key);
    return storedData ? JSON.parse(storedData) : config.initialState;
  };

  const [data, setDataState] = useState<DataType>(getInitialData);

  // Whenever data changes, update local storage
  useEffect(() => {
    localStorage.setItem(config.key, JSON.stringify(data));
  }, [data, config.key]);

  const setData = (newData: DataType) => {
    setDataState(newData);
    // Note: We don't need to explicitly call `localStorage.setItem` here
    // since the useEffect will handle the synchronization.
  };

  return [data, setData];
}
