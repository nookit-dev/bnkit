import Bun from "bun";
import { createGitHubActionsFactory } from "modules/github-actions";
import { npmReleaseFactory } from "modules/npm-release";
import { ulog } from "modules/utils/ulog";
import path from "path";

const NPM_TOKEN = Bun.env.NPM_TOKEN || "";
const MAX_RETRIES = Number(Bun.env.MAX_PUBLISH_RETRY) || 10; // Define a max number of retries to prevent infinite loops

const e = Bun.env;

const { npmPublish, setupNpmAuth, updatePackageVersion } = npmReleaseFactory({
  maxRetries: MAX_RETRIES,
  npmToken: NPM_TOKEN,
});

const { commitAndPush, setupGitConfig } = createGitHubActionsFactory({
  sshRepoUrl: "git@github.com:brandon-schabel/u-tools.git",
});

const isLocalRun = Bun.env.LOCAL_RUN === "true";

const isAlpha = isLocalRun
  ? false
  : Bun.env.GITHUB_EVENT_NAME === "pull_request";

const corePackagePath = path.resolve(process.cwd(), "package.json");

const pluginReactPath = path.resolve(
  process.cwd(),
  "plugins",
  "react",
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
const newVersion = await updatePackageVersion(corePackagePath, isAlpha);
await npmPublish({ packagePath: corePackagePath, isAlpha });

await updatePackageVersion(pluginReactPath, isAlpha);
await npmPublish({ packagePath: pluginReactPath, isAlpha });

if (!isLocalRun && !isAlpha) {
  await commitAndPush(`Pushing version: ${newVersion}`);
}
