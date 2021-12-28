import { Command } from "commander";

export const serveCmd = new Command()
  .command("serve [filename]")
  .description("Open a file for editing")
  .option("-p, --port <number>", "port to run server on", "1005")
  .action((filename = "notebook.js", opts) => {
    console.log(opts, filename);
  });
