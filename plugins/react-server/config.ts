import * as path from "path";

export type ENV_MODES = "DEV" | "PROD";

export const PROJECT_ROOT = import.meta.dir;
export const BUILD_DIR = path.resolve(PROJECT_ROOT, "build");
export const PUBLIC_DIR = path.resolve(PROJECT_ROOT, "public");
export const MODE: ENV_MODES = (process.env.MODE as ENV_MODES) || "DEV";
export const JS_ENTRY_FILE = "index.js";
