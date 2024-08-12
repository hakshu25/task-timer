import { durationTime } from "../utils/date.ts";

export type TaskStatus = 'in_progress' | 'pause' | 'done';

export interface InProgressTask {
  name: string;
  startTime: Date;
  pauseTime?: undefined;
  resumeTime?: Date;
  totalPausedTime: number;
  status: Extract<TaskStatus, 'in_progress'>;
}

export interface PausedTask {
  name: string;
  startTime: Date;
  endTime?: undefined;
  pauseTime: Date;
  resumeTime?: Date;
  totalPausedTime: number;
  status: Extract<TaskStatus, 'pause'>;
}

export interface DoneTask {
  name: string;
  startTime: Date;
  endTime: Date;
  pauseTime?: Date;
  resumeTime?: Date;
  totalPausedTime: number;
  status: Extract<TaskStatus, 'done'>;
}

export type Task = InProgressTask | PausedTask | DoneTask;

function isTaskDone(task: Task): task is DoneTask {
  return task.status === 'done';
}

export function isTaskPaused(task: Task): task is PausedTask {
  return task.status === 'pause';
}

export function isTaskInProgress(task: Task): task is InProgressTask {
  return task.status === 'in_progress';
}

export function getTaskDuration(task: Task): number {
  if (isTaskDone(task)) {
    return durationTime(task.startTime.getTime(), task.endTime.getTime()) - task.totalPausedTime;
  }

  if (isTaskPaused(task)) {
    return durationTime(task.startTime.getTime(), task.pauseTime.getTime());
  }

  return durationTime(task.startTime.getTime(), new Date().getTime()) - task.totalPausedTime;
}

export function createNewTask(name: string, startTime: Date = new Date()): InProgressTask {
  return {
    name,
    startTime,
    totalPausedTime: 0,
    status: 'in_progress',
  };
}

export function completeTask(task: InProgressTask, endTime: Date = new Date()): DoneTask {
  return {
    ...task,
    endTime,
    status: 'done',
  };
}

export function pauseTask(task: InProgressTask, pauseTime: Date = new Date()): PausedTask {
  return {
    ...task,
    pauseTime,
    status: 'pause',
  };
}

export function resumeTask(task: PausedTask, resumeTime: Date = new Date()): InProgressTask {
  const totalPausedTime = task.totalPausedTime + durationTime(task.pauseTime.getTime(), resumeTime.getTime());

  return {
    ...task,
    pauseTime: undefined,
    resumeTime,
    totalPausedTime,
    status: 'in_progress',
  };
}
