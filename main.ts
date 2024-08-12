import { parseArgs } from "@std/cli/parse-args";
import { listTasks } from "./src/task.ts";

const tasksFilePath = "./data/tasks.json";

const args = parseArgs(Deno.args);
const command = args._[0];

switch (command) {
  case "list":
    await listTasks(tasksFilePath);
    break;
  default:
    await listTasks(tasksFilePath);
    console.log("Available commands: list");
    break;
}
