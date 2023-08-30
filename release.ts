import Bun from "bun";
import path from "path";
import { exit } from "process";

const GITHUB_PAT = Bun.env.PERSONAL_ACCESS_TOKEN_GITHUB || "";
const NPM_TOKEN = Bun.env.NPM_TOKEN || "";
const MAX_RETRIES = Number(Bun.env.MAX_PUBLISH_RETRY) || 10; // Define a max number of retries to prevent infinite loops

const ulog = (...args: any[]) => {
  const currentTime = Bun.nanoseconds() / 1e9; // Convert to seconds
  console.log(`[${currentTime.toFixed(4)}s]`, args);
};

const e = Bun.env;

ulog({
  actor: e?.GITHUB_ACTOR,
  job: e?.GITHUB_JOB,
  refType: e?.GITHUB_REF_TYPE,
  runner: e?.RUNNER_NAME,
  gitHubAction: e.GITHUB_ACTION,
  runNumber: e.GITHUB_RUN_NUMBER,
  runnerEnv: e?.RUNNNER_ENVIRONMENT,
});

const getCurrentVersion = async (packagePath: string): Promise<string> => {
  const packageData = await Bun.file(packagePath).text();
  const parsedData = JSON.parse(packageData);
  return parsedData.version;
};

/* Helper Functions */
const setupNpmAuth = () => {
  try {
    if (!NPM_TOKEN) {
      console.error("NPM_TOKEN is not set in environment variables.");
      exit(1);
    }
    const npmrcContent = `//registry.npmjs.org/:_authToken=${NPM_TOKEN}`;
    const npmrcPath = path.resolve(process.cwd(), ".npmrc");
    Bun.write(npmrcPath, npmrcContent);
  } catch (error) {
    console.error("Failed to set up npm authentication:", error);
    exit(1);
  }
};

const npmPublish = async ({
  isAlpha,
  packagePath,
}: {
  packagePath: string;
  isAlpha: boolean;
}) => {
  const dir = path.dirname(packagePath);

  let success = false;

  for (let i = 0; i < MAX_RETRIES && !success; i++) {
    ulog(
      `Publishing from directory: ${dir}, attempt ${i + 1} of ${MAX_RETRIES}`
    );

    const proc = Bun.spawnSync(["npm", "publish"], {
      cwd: dir,
    });

    const response = proc.stdout.toString();
    console.log({ response });

    const errorResponse = proc.stderr.toString();
    console.log({ errorResponse });

    // If there's a specific error indicating a version conflict
    if (
      errorResponse.includes(
        "cannot publish over the previously published versions"
      )
    ) {
      ulog(`Version conflict for ${dir}, trying next version...`);

      const currentVersion = await getCurrentVersion(packagePath);
      const newVersion = updateVersion(currentVersion, false);
      ulog(`Updating version from ${currentVersion} to ${newVersion}`);
      await updatePackageVersion(packagePath, isAlpha, newVersion);

      // Don't set success to true; let the loop continue to retry with the new version
    } else {
      // If there's no specific version conflict error, assume success
      success = true;
    }
  }

  if (!success) {
    console.error(`Failed to publish after ${MAX_RETRIES} attempts.`);
    exit(1);
  }
};

const updateVersion = (currentVersion: string, isAlpha: boolean): string => {
  const [major, minor, patch] = currentVersion.split(".").map(Number);
  if (isAlpha) {
    const alphaHash = Math.random().toString(36).substr(2, 8);
    return `${major}.${minor}.${patch}-alpha.${alphaHash}`;
  } else {
    return `${major}.${minor}.${patch + 1}`;
  }
};

const updatePackageVersion = async (
  packagePath: string,
  isAlpha: boolean,
  newVersion?: string
) => {
  ulog(`Updating ${packagePath}`);
  const packageData = await Bun.file(packagePath).text();
  const parsedData = JSON.parse(packageData);
  parsedData.version = newVersion || updateVersion(parsedData.version, isAlpha); // Use the provided new version if available
  await Bun.write(packagePath, JSON.stringify(parsedData, null, 2));
  return parsedData.version;
};

const gitCmd = async (commands: string[], log = true) => {
  const commandArray = ["git", ...commands];

  try {
    if (log) ulog(`Running command: ${commandArray.join(" ")}`);

    const proc = Bun.spawn(commandArray);

    const stdout = await new Response(proc.stdout).text();

    if (stdout.trim()) {
      ulog(stdout.trim());
    }

    const stderr = await new Response(proc.stderr).text();
    if (stderr.trim()) {
      console.error(stderr.trim());
    }
  } catch (error) {
    console.error(`Failed to run command: ${commandArray}:`, error);
    exit(1);
  }
};

const commitAndPush = async (commitMsg: string) => {
  ulog("*** Running git commands ***");

  // Use the SSH to set the remote URL with authentication
  await gitCmd([
    "remote",
    "set-url",
    "origin",
    "git@github.com:brandon-schabel/u-tools.git",
  ]);
  ulog("Configured GitHub User");
  await gitCmd(["config", "user.name"]);

  ulog("Configured GitHub Email");
  await gitCmd(["config", "user.email"]);

  await gitCmd(["add", "."]);
  await gitCmd(["commit", "-m", `[skip ci] ${commitMsg}`]);
  await gitCmd(["push", "origin", "HEAD:main"]);
};

const setupGitConfig = async () => {
  ulog("*** Configuring Git ***");

  // Configure user name and email
  ulog("Configuring GitHub User");
  await gitCmd(["config", "--global", "user.name", "brandon-schabel"]);

  ulog("Configured Git User: ", await gitCmd(["config", "user.name"]));

  ulog("Configuring GitHub Email");
  await gitCmd([
    "config",
    "--global",
    "user.email",
    "brandonschabel1995@gmail.com",
  ]);

  ulog("Configured Git Email: ", await gitCmd(["config", "user.email"]));

  // Use the PAT to set the remote URL with authentication
  // ulog("Setting up remote URL with PAT");

  // await gitCmd([
  //   "remote",
  //   "set-url",
  //   "origin",
  //   `git@github.com:brandon-schabel/u-tools.git`,
  // ]);
};

const isLocalRun = process.env.LOCAL_RUN === "true";

// const isAlpha = isLocalRun
//   ? false
//   : Bun.env.GITHUB_EVENT_NAME === "pull_request";
// FORCE Release
const isAlpha = false;

const corePackagePath = path.resolve(process.cwd(), "package.json");

const pluginReactPath = path.resolve(
  process.cwd(),
  "plugins",
  "react",
  "package.json"
);

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
