# task-timer

## Description

This is a simple task timer that allows you to track the time you spend on
tasks. It is a command line application that allows you to start and stop tasks,
and view the time you have spent on each task.

## Installation

To install the task timer, clone the repository and run the following command:

```sh
deno install --allow-read --allow-write --name task-timer https://raw.githubusercontent.com/hakshu25/task-timer/main/src/main.ts
```

## Usage

set environment variable `TASK_TIMER_FILE` to the path of the file where the
tasks are stored.

```sh
export TASK_TIMER_FILE=<path-to-file>
```

To start a task, run the following command:

```sh
task-timer start <task-name>
```

To stop a task, run the following command:

```sh
task-timer stop <task-name>
```

To pause a task, run the following command:

```sh
task-timer pause <task-name>
```

To resume a task, run the following command:

```sh
task-timer resume <task-name>
```

To view the time spent on tasks, run the following command:

```sh
task-timer
```
