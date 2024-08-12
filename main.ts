import { parseArgs } from "@std/cli/parse-args";
import { endTask, listTasks, pauseTask, resumeTask, startTask } from "./src/commands.ts";

const tasksFilePath = "./data/tasks.json";

const args = parseArgs(Deno.args);
const command = args._[0];
const taskName: string | boolean | undefined = args.name || args.n;

switch (command) {
  case "list":
    await listTasks(tasksFilePath);
    break;
  case "start":
    if (!taskName || taskName === true) {
      console.log("Please provide a task name using --name or -n option.");
    } else {
      await startTask(taskName, tasksFilePath);
    }
    break;
  case "end":
    if (!taskName || taskName === true) {
      console.log("Please provide a task name using --name or -n option.");
    } else {
      await endTask(taskName, tasksFilePath);
    }
    break;
  case "pause":
    if (!taskName || taskName === true) {
      console.log("Please provide a task name using --name or -n option.");
    } else {
      await pauseTask(taskName, tasksFilePath);
    }
    break;
  case "resume":
    if (!taskName || taskName === true) {
      console.log("Please provide a task name using --name or -n option.");
    } else {
      await resumeTask(taskName, tasksFilePath);
    }
    break;
  default:
    await listTasks(tasksFilePath);
    console.log("Available commands: list");
    break;
}
