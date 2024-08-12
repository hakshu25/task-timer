import {
  completeTask,
  createNewTask,
  DoneTask,
  isTaskInProgress,
  isTaskPaused,
  pauseTask,
  resumeTask,
  Task,
} from "../domains/task.ts";
import {
  findTask,
  getAllTasks,
  saveTask,
  updateTaskEndTime,
  updateTaskForResume,
  updateTaskPauseTime,
} from "../repositories/task_repository.ts";

export async function listTasksUsecase(filePath: string): Promise<Task[]> {
  return await getAllTasks(filePath);
}

export async function startTaskUsecase(
  name: string,
  filePath: string,
): Promise<void> {
  const task = createNewTask(name);
  await saveTask(task, filePath);
}

export async function endTaskUsecase(
  name: string,
  filePath: string,
): Promise<DoneTask> {
  const task = await findTask(name, filePath);

  if (!task || !isTaskInProgress(task)) {
    throw new Error("Task is not found or not in progress.");
  }

  const doneTask = completeTask(task);
  await updateTaskEndTime(doneTask, filePath);
  return doneTask;
}

export async function pauseTaskUsecase(
  name: string,
  filePath: string,
): Promise<void> {
  const task = await findTask(name, filePath);

  if (!task || !isTaskInProgress(task)) {
    throw new Error("Task is not found or not in progress.");
  }

  const pausedTask = pauseTask(task);
  await updateTaskPauseTime(pausedTask, filePath);
}

export async function resumeTaskUsecase(
  name: string,
  filePath: string,
): Promise<void> {
  const task = await findTask(name, filePath);

  if (!task || !isTaskPaused(task)) {
    throw new Error("Task is not found or not paused.");
  }

  const resumedTask = resumeTask(task);
  await updateTaskForResume(resumedTask, filePath);
}
