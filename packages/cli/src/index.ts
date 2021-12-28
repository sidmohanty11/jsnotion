import { program } from "commander";
import { serveCmd } from "./commands/serve";

program.addCommand(serveCmd);

program.parse(process.argv);
