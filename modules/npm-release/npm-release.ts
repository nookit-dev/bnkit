import path from "path";
import { exit } from "process";
import { ulog } from "../utils/ulog";

export type NpmReleaseFactoryOptions = {
  maxRetries?: number;
  npmToken?: string;
};

export const getCurrentVersion = async (
  packagePath: string
): Promise<string> => {
  const packageData = await Bun.file(packagePath).text();
  const parsedData = JSON.parse(packageData);
  return parsedData.version;
};

export const setupNpmAuth = (npmToken: string) => {
  try {
    if (!npmToken) {
      console.error("NPM_TOKEN is not set in environment variables.");
      throw new Error("NPM_TOKEN is not set in environment variables.");
    }
    const npmrcContent = `//registry.npmjs.org/:_authToken=${npmToken}`;
    const npmrcPath = path.resolve(process.cwd(), ".npmrc");
    Bun.write(npmrcPath, npmrcContent);
  } catch (error) {
    console.error("Failed to set up npm authentication:", error);
    throw error;
  }
};

export const updateVersion = (
  currentVersion: string,
  isAlpha: boolean
): string => {
  const [major, minor, patch] = currentVersion.split(".").map(Number);
  if (isAlpha) {
    const alphaHash = Math.random().toString(36).substr(2, 8);
    return `${major}.${minor}.${patch}-alpha.${alphaHash}`;
  } else {
    return `${major}.${minor}.${patch + 1}`;
  }
};

export const updatePackageVersion = async (
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

type NpmPublishParams = {
  packagePath: string;
  isAlpha: boolean;
  maxRetries?: number;
};

export const npmPublish = async ({
  isAlpha,
  packagePath,
  maxRetries = 10,
}: NpmPublishParams) => {
  const dir = path.dirname(packagePath);

  let success = false;

  for (let i = 0; i < maxRetries && !success; i++) {
    ulog(
      `Publishing from directory: ${dir}, attempt ${i + 1} of ${maxRetries}`
    );

    const npmWhoIs = Bun.spawnSync(["npm", "whoami"]);
    ulog({ npmWhoIs: npmWhoIs.stdout.toString() });

    const publishScript = ["npm", "publish"];

    if (isAlpha) {
      publishScript.push("--tag", "alpha", "--access", "public");
    } else {
      publishScript.push("--access", "public");
    }

    const proc = Bun.spawnSync(publishScript, {
      cwd: dir,
    });

    const response = proc.stdout.toString();

    const errorResponse = proc.stderr.toString();

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
    console.error(`Failed to publish after ${maxRetries} attempts.`);
    exit(1);
  }
};

// TODO create the factory based on a package json file path
export function npmReleaseFactory(options: NpmReleaseFactoryOptions) {
  const { maxRetries = 10, npmToken } = options;

  return {
    getCurrentVersion: () => getCurrentVersion, // this returns a function, not the result of the function. Is this intentional?
    setupNpmAuth: () => setupNpmAuth(npmToken || ""),
    npmPublish: ({ isAlpha, packagePath }: NpmPublishParams) =>
      npmPublish({ isAlpha, packagePath, maxRetries }),
    updateVersion: (currentVersion: string, isAlpha: boolean) =>
      updateVersion(currentVersion, isAlpha),
    updatePackageVersion: (
      packagePath: string,
      isAlpha: boolean,
      newVersion?: string
    ) => updatePackageVersion(packagePath, isAlpha, newVersion),
  };
}
