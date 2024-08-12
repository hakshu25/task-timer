import { parseArgs } from "@std/cli/parse-args";
import {
  endTask,
  listTasks,
  pauseTask,
  resumeTask,
  startTask,
} from "./src/commands.ts";

const tasksFilePath = "./data/tasks.json";

const args = parseArgs(Deno.args);
const command = args._[0];
const taskName: string | number | undefined = args._[1];

async function main() {
  if (!command) {
    await listTasks(tasksFilePath);
    console.log("\nAvailable commands: start, end, pause, resume");
    return;
  }

  if (!taskName || typeof taskName === "number") {
    console.log("Please provide a task name.");
    return;
  }

  switch (command) {
    case "start":
      await startTask(taskName, tasksFilePath);
      break;
    case "end":
      await endTask(taskName, tasksFilePath);
      break;
    case "pause":
      await pauseTask(taskName, tasksFilePath);
      break;
    case "resume":
      await resumeTask(taskName, tasksFilePath);
      break;
  }
}

if (import.meta.main) {
  await main();
}
