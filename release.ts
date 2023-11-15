import Bun from "bun";
import path from "path";
import { exit } from "process";
import * as u from "./";
import { ulog } from "./utils/ulog";

// run bun test
const testProc = Bun.spawnSync(["bun", "test", "--coverage"], {});

const output = await u.deploy.logStdOutput(testProc);

if (!output) {
  ulog("No output");
  exit(1);
}

const NPM_TOKEN = Bun.env.NPM_TOKEN || "";
const MAX_RETRIES = Number(Bun.env.MAX_PUBLISH_RETRY) || 10; // Define a max number of retries to prevent infinite loops

const e = Bun.env;

const { npmPublish, setupNpmAuth, updatePackageVersion } =
  u.npm.npmReleaseFactory({
    maxRetries: MAX_RETRIES,
    npmToken: NPM_TOKEN,
  });

const { commitAndPush, setupGitConfig } = u.deploy.createGitHubActionsFactory({
  sshRepoUrl: "git@github.com:brandon-schabel/bun-nook-kit.git",
});

const isLocalRun = Bun.env.LOCAL_RUN === "true";

const isAlpha = isLocalRun
  ? false
  : Bun.env.GITHUB_EVENT_NAME === "pull_request";

const corePackagePath = path.resolve(process.cwd(), "package.json");

// todo resolve all plugin paths
const pluginReactPath = path.resolve(
  process.cwd(),
  "plugins",
  "react",
  "package.json"
);

const pluginReactServerPath = path.resolve(
  process.cwd(),
  "plugins",
  "react-server",
  "package.json"
);

ulog({
  actor: e?.GITHUB_ACTOR,
  job: e?.GITHUB_JOB,
  refType: e?.GITHUB_REF_TYPE,
  runner: e?.RUNNER_NAME,
  gitHubAction: e.GITHUB_ACTION,
  runNumber: e.GITHUB_RUN_NUMBER,
  runnerEnv: e?.RUNNNER_ENVIRONMENT,
  eventName: e?.GITHUB_EVENT_NAME,
  isLocalRun,
  isAlpha,
  corePackagePath,
  pluginReactPath,
});

/* Script */
if (!isLocalRun) {
  setupNpmAuth();
  await setupGitConfig();
}

ulog(`Updating versions to ${isAlpha ? "alpha" : "Release"}`);
const newVersion = await updatePackageVersion({
  packagePath: corePackagePath,
  isAlpha,
});
await npmPublish({ packagePath: corePackagePath, isAlpha });

await updatePackageVersion({ packagePath: pluginReactPath, isAlpha });
await npmPublish({ packagePath: pluginReactPath, isAlpha });

await updatePackageVersion({ packagePath: pluginReactServerPath, isAlpha });
await npmPublish({ packagePath: pluginReactServerPath, isAlpha });

if (!isLocalRun && !isAlpha) {
  await commitAndPush(`Pushing version: ${newVersion}`);
}
