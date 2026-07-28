const TASK_STORAGE_KEY = "taskBloomTasks";

export function getTasks() {
  try {
    const storedTasks =
      localStorage.getItem(TASK_STORAGE_KEY);

    if (!storedTasks) {
      return [];
    }

    const parsedTasks = JSON.parse(storedTasks);

    return Array.isArray(parsedTasks)
      ? parsedTasks
      : [];
  } catch (error) {
    console.error(
      "Unable to read tasks from Local Storage:",
      error
    );

    return [];
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(
      TASK_STORAGE_KEY,
      JSON.stringify(tasks)
    );

    return true;
  } catch (error) {
    console.error(
      "Unable to save tasks to Local Storage:",
      error
    );

    return false;
  }
}