import path from "path";
import { Command } from "commander";
import { serve } from "@jssnippets/server";

const isProd = process.env.NODE_ENV === "production";

export const serveCmd = new Command()
  .command("serve [filename]")
  .description("Open a file for editing")
  .option("-p, --port <number>", "port to run server on", "1005")
  .action(async (filename = "notebook.js", opts: { port: string }) => {
    try {
      const dir = path.join(process.cwd(), path.dirname(filename));
      const basename = path.basename(filename);
      await serve(parseInt(opts.port), basename, dir, !isProd);
      console.log(
        `Opened ${filename}. Navigate to http://localhost:${opts.port}/ to add your magic!`
      );
    } catch (err) {
      if (err.code === "EADDRINUSE") {
        console.log(
          "Port already in use! Try running on different port, using -p or --port"
        );
      } else {
        console.log("I found out the problem, ", err.message);
      }
      process.exit(1);
    }
  });
