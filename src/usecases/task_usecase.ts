import { Task } from "../domains/task.ts";
import { getAllTasks } from "../repositories/task_repository.ts";

export async function listTasksUsecase(filePath: string): Promise<Task[]> {
  return await getAllTasks(filePath);
}
