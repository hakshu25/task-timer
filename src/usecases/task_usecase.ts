import { createNewTask, Task } from "../domains/task.ts";
import { getAllTasks, saveTask } from "../repositories/task_repository.ts";

export async function listTasksUsecase(filePath: string): Promise<Task[]> {
  return await getAllTasks(filePath);
}

export async function startTaskUsecase(name: string, filePath: string) {
  const task = createNewTask(name);
  await saveTask(task, filePath);
}
