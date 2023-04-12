import { spawn as nodeSpawn, SpawnOptions } from "child_process";

type StdioType = "pipe" | "inherit" | "ignore" | null;

type ReadableSubprocess = {
  pid: number;
  stdin: StdioType;
  stdout: StdioType | NodeJS.ReadableStream;
  stderr: StdioType | NodeJS.ReadableStream;
  exited: Promise<number>;
  exitCode: number | null;
  signalCode: NodeJS.Signals | null;
  killed: boolean;
  unref: () => void;
  kill: (code?: NodeJS.Signals | number) => void;
};

type WritableSubprocess = {
  pid: number;
  stdin: StdioType | NodeJS.WritableStream;
  stdout: StdioType;
  stderr: StdioType;
  exited: Promise<number>;
  exitCode: number | null;
  signalCode: NodeJS.Signals | null;
  killed: boolean;
  unref: () => void;
  kill: (code?: NodeJS.Signals | number) => void;
};

export const spawn = (
  command: string[],
  options: SpawnOptions = {}
): ReadableSubprocess => {
  const subprocess = nodeSpawn(command[0], command.slice(1), options);

  const { stdin = "pipe", stdout = "pipe", stderr = "pipe" } = subprocess;

  return {
    pid: subprocess.pid,
    stdin,
    stdout,
    stderr,
    exited: new Promise((resolve) => subprocess.once("exit", resolve)),
    exitCode: null,
    signalCode: null,
    killed: false,
    unref: subprocess.unref.bind(subprocess),
    kill: subprocess.kill.bind(subprocess),
  };
};

export const spawnSync = (
  command: string[],
  options: SpawnOptions = {}
): WritableSubprocess => {
  const subprocess = nodeSpawn.sync(command[0], command.slice(1), options);

  const { stdin = "pipe", stdout = "pipe", stderr = "pipe" } = subprocess;

  return {
    pid: subprocess.pid,
    stdin,
    stdout,
    stderr,
    exited: Promise.resolve(subprocess.status),
    exitCode: subprocess.status,
    signalCode: null,
    killed: false,
    unref: subprocess.unref.bind(subprocess),
    kill: subprocess.kill.bind(subprocess),
  };
};
