import {
  DoneTask,
  InProgressTask,
  PausedTask,
  Task,
  TaskStatus,
} from "../domains/task.ts";

export interface TaskJsonObj {
  name: string;
  startTime: string;
  endTime?: string;
  pauseTime?: string;
  totalPausedTime: number;
}

function getTaskStatus(task: TaskJsonObj): TaskStatus {
  if (task.pauseTime !== undefined) {
    return "pause";
  } else if (task.endTime !== undefined) {
    return "done";
  }

  return "in_progress";
}

function buildTask(task: TaskJsonObj): Task {
  const baseTask = {
    name: task.name,
    startTime: new Date(task.startTime),
    totalPausedTime: task.totalPausedTime,
    status: getTaskStatus(task),
  };

  if (baseTask.status === "done") {
    return {
      ...baseTask,
      endTime: new Date(task.endTime!),
    } as DoneTask;
  } else if (baseTask.status === "pause") {
    return {
      ...baseTask,
      pauseTime: new Date(task.pauseTime!),
    } as PausedTask;
  }

  return baseTask as InProgressTask;
}

async function loadTasks(filePath: string): Promise<TaskJsonObj[]> {
  try {
    const data = await Deno.readTextFile(filePath);
    return JSON.parse(data) as TaskJsonObj[];
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      await Deno.writeTextFile(filePath, "[]");
      return [];
    }

    throw error;
  }
}

export async function getAllTasks(filePath: string): Promise<Task[]> {
  const data = await loadTasks(filePath);
  const tasks: Task[] = data.map((task: TaskJsonObj) => buildTask(task));
  return tasks;
}

export async function saveTask(task: Task, filePath: string) {
  const tasks = await loadTasks(filePath);
  tasks.push({
    name: task.name,
    startTime: task.startTime.toISOString(),
    totalPausedTime: task.totalPausedTime,
  });
  await Deno.writeTextFile(filePath, JSON.stringify(tasks));
}

export async function findTask(
  name: string,
  filePath: string,
): Promise<Task | undefined> {
  const tasks = await loadTasks(filePath);
  const taskJsonObj = tasks.find((task) => task.name === name);
  if (!taskJsonObj) {
    return undefined;
  }

  return buildTask(taskJsonObj);
}

export async function updateTaskEndTime(task: DoneTask, filePath: string) {
  const tasks = await loadTasks(filePath);
  const taskIndex = tasks.findIndex((t) => t.name === task.name);
  tasks[taskIndex].endTime = task.endTime!.toISOString();
  await Deno.writeTextFile(filePath, JSON.stringify(tasks));
}

export async function updateTaskPauseTime(task: PausedTask, filePath: string) {
  const tasks = await loadTasks(filePath);
  const taskIndex = tasks.findIndex((t) => t.name === task.name);
  tasks[taskIndex].pauseTime = task.pauseTime!.toISOString();
  await Deno.writeTextFile(filePath, JSON.stringify(tasks));
}

export async function updateTaskForResume(
  task: InProgressTask,
  filePath: string,
) {
  const tasks = await loadTasks(filePath);
  const taskIndex = tasks.findIndex((t) => t.name === task.name);
  tasks[taskIndex].totalPausedTime = task.totalPausedTime;
  delete tasks[taskIndex].pauseTime;
  await Deno.writeTextFile(filePath, JSON.stringify(tasks));
}
