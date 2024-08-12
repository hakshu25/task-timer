import { DoneTask, InProgressTask, PausedTask, Task, TaskStatus } from "../domains/task.ts";

export interface TaskJsonObj {
  name: string;
  startTime: string;
  endTime?: string;
  pauseTime?: string;
  resumeTime?: string;
  totalPausedTime: number;
}

function getTaskStatus(task: TaskJsonObj): TaskStatus {
  if (task.pauseTime !== undefined) {
    return 'pause';
  } else if(task.endTime !== undefined) {
    return 'done';
  }

  return 'in_progress';
}

function buildTask(task: TaskJsonObj): Task {
  const baseTask = {
    name: task.name,
    startTime: new Date(task.startTime),
    totalPausedTime: task.totalPausedTime,
    status: getTaskStatus(task),
  };

  if (baseTask.status === 'done') {
    return {
      ...baseTask,
      endTime: new Date(task.endTime!),
    } as DoneTask;
  } else if (baseTask.status === 'pause') {
    return {
      ...baseTask,
      pauseTime: new Date(task.pauseTime!),
      resumeTime: task.resumeTime ? new Date(task.resumeTime) : undefined,
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