import { ulog } from "modules/utils/ulog";
import { exit } from "process";

export function createGitHubActionsFactory({
  sshRepoUrl,
}: {
  sshRepoUrl: string; // for now just ssh based
}) {
  const gitCmd = async (commands: string[], log = true) => {
    const commandArray = ["git", ...commands];

    try {
      if (log) ulog(`Running command: ${commandArray.join(" ")}`);

      const proc = Bun.spawnSync(commandArray);

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
    await gitCmd(["remote", "set-url", "origin", sshRepoUrl]);
    ulog("Configured GitHub User");
    await gitCmd(["config", "user.name"]);

    ulog("Configured GitHub Email");
    await gitCmd(["config", "user.email"]);

    await gitCmd(["add", "."]);
    await gitCmd(["commit", "-m", `[skip ci] ${commitMsg}`]);
    await gitCmd(["push", "origin", "HEAD:main"]);
  };

  const setupGitConfig = async (
    {
      githubEmail,
      githubUsername,
    }: {
      // optional username and email for the git config, but defaults to the github-actions bot
      githubUsername: string;
      githubEmail: string;
    } = {
      githubUsername: "github-actions[bot]",
      githubEmail: "41898282+github-actions[bot]@users.noreply.github.com",
    }
  ) => {
    ulog("*** Configuring Git ***");

    // Configure user name and email
    ulog("Configuring GitHub User");
    await gitCmd(["config", "--global", "user.name", githubUsername]);

    ulog("Configured Git User: ", await gitCmd(["config", "user.name"]));

    ulog("Configuring GitHub Email");
    await gitCmd(["config", "--global", "user.email", githubEmail]);

    ulog("Configured Git Email: ", await gitCmd(["config", "user.email"]));
  };

  return {
    gitCmd,
    commitAndPush,
    setupGitConfig,
  };
}
