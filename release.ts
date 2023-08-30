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

const npmPublish = async (packagePath: string, isAlpha: boolean) => {
  const dir = path.dirname(packagePath);

  let publishedSuccessfully = false;

  for (let i = 0; i < MAX_RETRIES && !publishedSuccessfully; i++) {
    ulog(
      `Publishing from directory: ${dir}, attempt ${i + 1} of ${MAX_RETRIES}`
    );

    const proc = Bun.spawn(["npm", "publish"], {
      cwd: dir,
      onExit: async (proc, exitCode, signalCode, error) => {
        const errorString = proc.stderr?.toString();
        ulog({ errorString });

        if (errorString?.includes("403 Forbidden")) {
          ulog(`Version conflict for ${dir}, trying next version...`);
          await updatePackageVersion(packagePath, isAlpha);
        } else if (exitCode !== 0) {
          console.error(`Failed to publish from ${dir}:`, errorString);
          exit(1);
        } else {
          publishedSuccessfully = true;
        }
      },
    });

    // Since the onExit callback might be asynchronous, you may need to ensure that the process has completed
    // before continuing the loop. This depends on the behavior of the Bun library.
    await proc.exited;
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

const updatePackageVersion = async (packagePath: string, isAlpha: boolean) => {
  ulog(`Updating ${packagePath}`);
  const packageData = await Bun.file(packagePath).text();
  const parsedData = JSON.parse(packageData);
  parsedData.version = updateVersion(parsedData.version, isAlpha);
  await Bun.write(packagePath, JSON.stringify(parsedData, null, 2));
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

const commitAndPush = async () => {
  ulog("*** Running git commands ***");

  // Use the PAT to set the remote URL with authentication
  await gitCmd([
    "remote",
    "set-url",
    "origin",
    `https://${GITHUB_PAT}@github.com/brandon-schabel/u-tools.git`,
  ]);

  ulog("Configured GitHub User");
  await gitCmd(["config", "user.name"]);

  ulog("Configured GitHub Email");
  await gitCmd(["config", "user.email"]);

  await gitCmd(["add", "."]);
  await gitCmd(["commit", "-m", "Bump versions"]);
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
  ulog("Setting up remote URL with PAT");

  await gitCmd([
    "remote",
    "set-url",
    "origin",
    `https://${GITHUB_PAT}@github.com/brandon-schabel/u-tools.git`,
  ]);
};

const isLocalRun = process.env.LOCAL_RUN === "true";

// const isAlpha = isLocalRun
//   ? false
//   : Bun.env.GITHUB_EVENT_NAME === "pull_request";
// FORCE Release
const isAlpha = false;

ulog({
  env: Bun.env,
});

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
await updatePackageVersion(corePackagePath, isAlpha);
await npmPublish(corePackagePath, isAlpha);

await updatePackageVersion(pluginReactPath, isAlpha);
await npmPublish(pluginReactPath, isAlpha);

if (!isLocalRun && !isAlpha) {
  await commitAndPush();
}
