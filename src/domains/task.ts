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
  endTime: undefined;
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

function isTaskPaused(task: Task): task is PausedTask {
  return task.status === 'pause';
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