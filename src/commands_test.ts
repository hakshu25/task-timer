import { assertEquals } from "@std/assert/equals";
import { startTask, endTask, pauseTask, resumeTask, listTasks } from "./commands.ts";
import { assert, assertExists, assertStringIncludes } from "@std/assert";
import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  it,
} from "@std/testing/bdd";
import { spy, Stub } from "@std/testing/mock";

const testFilePath = "./data/test_tasks.json";

async function loadTasksHelper() {
  return JSON.parse(await Deno.readTextFile(testFilePath));
}

describe("Task", () => {
  let consoleSpy: Stub;

  beforeEach(async () => {
    await Deno.writeTextFile(testFilePath, "[]");    
    consoleSpy = spy(console, "log") as Stub;
  })


  afterEach(() => {
    consoleSpy.restore();
  })

  afterAll(async () => {
    await Deno.remove(testFilePath);
  });

  it("startTask", async () => {
    await startTask("Test Task", testFilePath);
    const tasks = await loadTasksHelper();

    assertEquals(tasks.length, 1);
    assertEquals(tasks[0].name, "Test Task");
    assertExists(tasks[0].startTime);
  });

  it("endTask", async () => {
    await startTask("Test Task", testFilePath);
    await endTask("Test Task", testFilePath);
    const tasks = await loadTasksHelper();

    assertEquals(tasks.length, 1);
    assertExists(tasks[0].endTime);
    assert(tasks[0].endTime! > tasks[0].startTime);
  });

  it("pauseTask and resumeTask", async () => {
    await startTask("Test Task", testFilePath);
    await pauseTask("Test Task", testFilePath);
    const tasksAfterPause = await loadTasksHelper();

    assertEquals(tasksAfterPause.length, 1);
    assertExists(tasksAfterPause[0].pauseTime);

    await resumeTask("Test Task", testFilePath);
    const tasksAfterResume = await loadTasksHelper();

    assertEquals(tasksAfterResume.length, 1);
    assertEquals(tasksAfterResume[0].pauseTime, undefined);
    assert(tasksAfterResume[0].totalPausedTime > 0);
  });

  it("listTasks", async () => {
    await startTask("Test Task", testFilePath);
    await endTask("Test Task", testFilePath);

    await listTasks(testFilePath);

    assertEquals(consoleSpy.calls.length > 0, true);
    const output = consoleSpy.calls.map(call => call.args.join(" ")).join("\n");
    assertStringIncludes(output, "Test Task");
    assertStringIncludes(output, "Duration:");
    assertStringIncludes(output, "done");
  });
});
