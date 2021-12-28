import path from "path";
import { Command } from "commander";
import { serve } from "server";

export const serveCmd = new Command()
  .command("serve [filename]")
  .description("Open a file for editing")
  .option("-p, --port <number>", "port to run server on", "1005")
  .action((filename = "notebook.js", opts: { port: string }) => {
    const dir = path.join(process.cwd(), path.dirname(filename));
    const basename = path.basename(filename);
    serve(parseInt(opts.port), basename, dir);
  });
