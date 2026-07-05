import { saveTasks } from "./storage.js";

export function initDragAndDrop(taskList, tasks, render) {
  new Sortable(taskList, {
    animation: 300,

    ghostClass: "dragging",

    onEnd(event) {
      const { oldIndex, newIndex } = event;

      if (oldIndex === newIndex) return;

      const movedTask = tasks.splice(oldIndex, 1)[0];

      tasks.splice(newIndex, 0, movedTask);

      saveTasks(tasks);

      render();
    }
  });
}