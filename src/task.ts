interface Task {
  name: string;
  startTime: Date;
  endTime?: Date;
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

function formatDuration(milliseconds: number): string {
  const seconds = milliseconds / 1000;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export async function listTasks(filePath: string) {
  const tasks = await loadTasks(filePath);
  if (tasks.length === 0) {
    console.log("No tasks recorded.");
    return;
  }
  tasks.forEach((task) => {
    const duration = task.endTime
      ? formatDuration(task.endTime.getTime() - task.startTime.getTime())
      : "In progress";
    console.log(
      `Task: ${task.name} | Start: ${task.startTime.toLocaleString()} | Duration: ${duration}`,
    );
  });
}

export async function startTask(name: string, filePath: string) {
  const tasks = await loadTasks(filePath);
  const startTime = new Date();
  tasks.push({ name, startTime });
  await saveTasks(tasks, filePath);
  console.log(`Started task: ${name} at ${startTime.toLocaleString()}`);
}
