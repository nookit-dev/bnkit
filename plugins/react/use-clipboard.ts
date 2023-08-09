import { useCallback, useState } from "react";

export type UseClipboardReturnType = {
  clipboardData: string | null;
  setClipboard: (data: string) => Promise<void>;
  getClipboard: () => Promise<void>;
};

export function useClipboard(
  externalValue?: string,
  updater?: (value: string) => void
): UseClipboardReturnType {
  const [internalClipboardData, setInternalClipboardData] = useState<
    string | null
  >(externalValue || null);

  const clipboardData =
    externalValue !== undefined ? externalValue : internalClipboardData;

  // Write to clipboard
  const setClipboard = useCallback(
    async (data: string) => {
      try {
        await navigator.clipboard.writeText(data);
        if (updater) {
          updater(data);
        } else {
          setInternalClipboardData(data);
        }
      } catch (error) {
        console.error("Failed to write to clipboard", error);
      }
    },
    [updater]
  );

  // Read from clipboard
  const getClipboard = useCallback(async () => {
    try {
      const data = await navigator.clipboard.readText();
      if (updater) {
        updater(data);
      } else {
        setInternalClipboardData(data);
      }
    } catch (error) {
      console.error("Failed to read from clipboard", error);
    }
  }, [updater]);

  return {
    clipboardData,
    setClipboard,
    getClipboard,
  };
}
