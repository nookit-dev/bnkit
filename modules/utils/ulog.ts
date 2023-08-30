// utility log
import Bun from "bun";

export const ulog = (...args: any[]) => {
  const currentTime = Bun.nanoseconds() / 1e9; // Convert to seconds
  console.log(`[${currentTime.toFixed(4)}s]`, args);
};
