import { completeTask, createNewTask, DoneTask, isTaskInProgress, Task } from "../domains/task.ts";
import { findTask, getAllTasks, saveTask, updateTaskEndTime } from "../repositories/task_repository.ts";

export async function listTasksUsecase(filePath: string): Promise<Task[]> {
  return await getAllTasks(filePath);
}

export async function startTaskUsecase(name: string, filePath: string) {
  const task = createNewTask(name);
  await saveTask(task, filePath);
}

export async function endTaskUsecase(name: string, filePath: string): Promise<DoneTask> {
  const task = await findTask(name, filePath);

  if (!task || !isTaskInProgress(task)) {
    throw new Error("Task is not found or not in progress.");
  }

  const doneTask = completeTask(task);
  await updateTaskEndTime(doneTask, filePath);
  return doneTask;
}