import { parseArgs } from "@std/cli/parse-args";
import { endTask, listTasks, pauseTask, startTask } from "./src/task.ts";

const tasksFilePath = "./data/tasks.json";

const args = parseArgs(Deno.args);
const command = args._[0];
const taskName = args.name || args.n;

switch (command) {
  case "list":
    await listTasks(tasksFilePath);
    break;
  case "start":
    if (!taskName) {
      console.log("Please provide a task name using --name or -n option.");
    } else {
      await startTask(taskName, tasksFilePath);
    }
    break;
  case "end":
    if (!taskName) {
      console.log("Please provide a task name using --name or -n option.");
    } else {
      await endTask(taskName, tasksFilePath);
    }
    break;
  case "pause":
    if (!taskName) {
      console.log("Please provide a task name using --name or -n option.");
    } else {
      await pauseTask(taskName, tasksFilePath);
    }
    break;
  default:
    await listTasks(tasksFilePath);
    console.log("Available commands: list");
    break;
}
