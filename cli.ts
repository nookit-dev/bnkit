import { spawn } from "./spawn";

const fs = require("fs");
const path = require("path");

const appsDir = "./_apps";

const appFiles = fs
  .readdirSync(appsDir)
  .filter((filename) => path.extname(filename) === ".ts")
  .map((filename) => path.join(appsDir, filename));

console.log(`Choose an app to run (${appFiles.join(", ")}):`);

process.stdin.once("data", (data: Buffer) => {
  const input = data.toString().trim();
  const chosenAppFile = appFiles.find((file) => file === input);

  if (!chosenAppFile) {
    console.log("Invalid choice.");
    process.exit(1);
  }

  const proc = spawn(["npx", "ts-node", chosenAppFile]);

  proc.stdout?.pipe(process.stdout);
  proc.stderr?.pipe(process.stderr);

  proc.exited.then((code) => {
    console.log(`Process exited with code ${code}`);
  });
});
