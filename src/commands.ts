import { getTaskDuration } from "./domains/task.ts";
import { endTaskUsecase, listTasksUsecase, pauseTaskUsecase, resumeTaskUsecase, startTaskUsecase } from "./usecases/task_usecase.ts";
import { formatDuration } from "./utils/date.ts";


export async function listTasks(filePath: string) {
  const tasks = await listTasksUsecase(filePath);
  if (tasks.length === 0) {
    console.log("No tasks recorded.");
    return;
  }

  tasks.forEach((task) => {
    console.log(
      `${task.name} | Start: ${task.startTime.toLocaleString()} | Duration: ${formatDuration(getTaskDuration(task))} | Status: ${task.status}`,
    );
  });
}

export async function startTask(name: string, filePath: string) {
  await startTaskUsecase(name, filePath);
  console.log(`Started task: ${name}}`);
}

export async function endTask(name: string, filePath: string) {
  try {
    const task = await endTaskUsecase(name, filePath);
    console.log(`Task ${task.name} ended.`);
    console.log(`Duration: ${formatDuration(getTaskDuration(task))}`);
  } catch (error) {
    console.log(error.message);
  }
}

export async function pauseTask(name: string, filePath: string) {
  try {
    await pauseTaskUsecase(name, filePath);
    console.log(`Task '${name}' paused`);
  } catch (error) {
    console.log(error.message);
  }
}

export async function resumeTask(name: string, filePath: string) {
  try {
    await resumeTaskUsecase(name, filePath);
    console.log(`Task '${name}' resumed`);
  } catch (error) {
    console.log(error.message);
  }
}
