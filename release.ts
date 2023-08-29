import Bun from "bun";
import path from "path";
import { exit } from "process";

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

const commitAndPush = async () => {
  try {
    console.log("Running git commands");
    await Bun.spawn(["git", "add", "-A"]);
    await Bun.spawn(["git", "commit", "-m", "Bump versions"]);
    await Bun.spawn(["git", "push", "origin", "HEAD:main"]);
  } catch (error) {
    console.error(error);
    exit(1);
  }
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

console.log(`Updating versions to ${isAlpha ? "alpha" : "Release"}`);
await updatePackageVersion(corePackagePath, isAlpha);

await updatePackageVersion(pluginReactPath, isAlpha);

if (!isLocalRun) {
  await commitAndPush();
}
