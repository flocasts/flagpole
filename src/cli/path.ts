import { Cli } from "./cli";

const fs = require("fs");

export function path() {
  if (fs.existsSync(Cli.projectPath)) {
    // Query the entry
    let stats = fs.lstatSync(Cli.projectPath);
    // Is it a directory?
    if (!stats.isDirectory()) {
      Cli.log("The path you specified is not a directory.");
      Cli.exit(1);
    }
  } else {
    Cli.log("The path you specified did not exist.");
    Cli.exit(1);
  }
}
