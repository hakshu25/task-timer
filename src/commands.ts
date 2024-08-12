import { getTaskDuration } from "./domains/task.ts";
import { endTaskUsecase, listTasksUsecase, pauseTaskUsecase, resumeTaskUsecase, startTaskUsecase } from "./usecases/task_usecase.ts";
import { formatDuration } from "./utils/date.ts";

interface Task {
  name: string;
  startTime: Date;
  endTime?: Date;
  pauseTime?: Date;
  resumeTime?: Date;
  totalPausedTime: number;
}

async function saveTasks(tasks: Task[], filePath: string): Promise<void> {
  const data = JSON.stringify(tasks);
  await Deno.writeTextFile(filePath, data);
}

async function loadTasks(filePath: string): Promise<Task[]> {
  try {
    const data = await Deno.readTextFile(filePath);
    const tasks: Task[] = JSON.parse(data).map((task: Task) => ({
      ...task,
      startTime: new Date(task.startTime),
      endTime: task.endTime ? new Date(task.endTime) : undefined,
      pauseTime: task.pauseTime ? new Date(task.pauseTime) : undefined,
      resumeTime: task.resumeTime ? new Date(task.resumeTime) : undefined,
      totalPausedTime: task.totalPausedTime || 0,
    }));
    return tasks;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      await saveTasks([], filePath);
      return [];
    }

    throw error;
  }
}

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
