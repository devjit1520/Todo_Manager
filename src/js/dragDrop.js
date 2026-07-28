export function initDragAndDrop(
  taskList,
  onReorder
) {
  if (
    !taskList ||
    typeof window.Sortable !== "function"
  ) {
    return null;
  }

  return new window.Sortable(taskList, {
    animation: 260,
    handle: ".drag-handle",
    ghostClass: "sortable-ghost",
    dragClass: "sortable-drag",

    onEnd() {
      const orderedIds = [
        ...taskList.querySelectorAll(
          "[data-task-id]"
        )
      ].map(
        element =>
          element.dataset.taskId
      );

      onReorder(orderedIds);
    }
  });
}