interface Task {
  name: string;
  startTime: Date;
  endTime?: Date;
  pauseTime?: Date;
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
    const durationMilliseconds = task.endTime
      ? task.endTime.getTime() - task.startTime.getTime() - (task.totalPausedTime * 1000)
      : (new Date().getTime() - task.startTime.getTime() - (task.totalPausedTime * 1000));
    const duration = formatDuration(durationMilliseconds);
    const status = task.endTime ? "Ended" : task.pauseTime ? "Paused" : "In progress";
    console.log(
      `Task: ${task.name} | Start: ${task.startTime.toLocaleString()} | Duration: ${duration} | Status: ${status}`,
    );
  });
}

export async function startTask(name: string, filePath: string) {
  const tasks = await loadTasks(filePath);
  const startTime = new Date();
  tasks.push({ name, startTime, totalPausedTime: 0 });
  await saveTasks(tasks, filePath);
  console.log(`Started task: ${name} at ${startTime.toLocaleString()}`);
}

export async function endTask(name: string, filePath: string) {
  const tasks = await loadTasks(filePath);
  const task = tasks.find((t) => t.name === name && !t.endTime);
  if (!task) {
    console.log(`Task ${name} not found or already ended.`);
    return;
  }
  if (task.pauseTime) {
    console.log(`Cannot end task '${name}' while it is paused.`);
    return;
  }
  task.endTime = new Date();
  await saveTasks(tasks, filePath);
  const duration = formatDuration(task.endTime.getTime() - task.startTime.getTime() - (task.totalPausedTime * 1000));
  console.log(`Task '${name}' ended at ${task.endTime.toLocaleString()}`);
  console.log(`Duration: ${duration}`);
}

export async function pauseTask(name: string, filePath: string) {
  const tasks = await loadTasks(filePath);
  const task = tasks.find((t) => t.name === name && !t.endTime && !t.pauseTime);
  if (!task) {
    console.log(`Task '${name}' not found or already paused.`);
    return;
  }
  task.pauseTime = new Date();
  await saveTasks(tasks, filePath);
  console.log(`Task '${name}' paused at ${task.pauseTime.toLocaleString()}`);
}