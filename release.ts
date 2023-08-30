import Bun from "bun";
import path from "path";
import { exit } from "process";

const GITHUB_PAT = Bun.env.PERSONAL_ACCESS_TOKEN_GITHUB || "";
const NPM_TOKEN = Bun.env.NPM_TOKEN || "";

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

const npmPublish = async (packagePath: string) => {
  const dir = path.dirname(packagePath);

  try {
    console.log(`Publishing from directory: ${dir}`);
    await Bun.spawn(["npm", "publish"], { cwd: dir });
  } catch (error) {
    console.error(`Failed to publish from ${dir}:`, error);
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

const updatePackageVersion = async (packagePath: string, isAlpha: boolean) => {
  console.log(`Updating ${packagePath}`);
  const packageData = await Bun.file(packagePath).text();
  const parsedData = JSON.parse(packageData);
  parsedData.version = updateVersion(parsedData.version, isAlpha);
  await Bun.write(packagePath, JSON.stringify(parsedData, null, 2));
};

const gitCmd = async (commands: string[]) => {
  const commandArray = ["git", ...commands];

  try {
    await Bun.spawn(commandArray);
  } catch (error) {
    console.error(`Failed to run command: ${commandArray}:`, error);
    exit(1);
  }
};

const commitAndPush = async () => {
  console.log("*** Running git commands ***");

  // Use the PAT to set the remote URL with authentication
  await gitCmd([
    "remote",
    "set-url",
    "origin",
    `https://${GITHUB_PAT}@github.com/brandon-schabel/u-tools.git`,
  ]);

  console.log("Configured GitHub User");
  await gitCmd(["config", "user.name"]);
  console.log("Configured GitHub Email");
  await gitCmd(["config", "user.email"]);

  await gitCmd(["add", "."]);
  await gitCmd(["commit", "-m", "Bump versions"]);
  await gitCmd(["push", "origin", "HEAD:main"]);
};

const isLocalRun = process.env.LOCAL_RUN === "true";

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

/* Script */
if (!isLocalRun) {
  setupNpmAuth();
}

console.log(`Updating versions to ${isAlpha ? "alpha" : "Release"}`);
await updatePackageVersion(corePackagePath, isAlpha);
await npmPublish(corePackagePath);

await updatePackageVersion(pluginReactPath, isAlpha);
await npmPublish(pluginReactPath);

if (!isLocalRun && !isAlpha) {
  await commitAndPush();
}
