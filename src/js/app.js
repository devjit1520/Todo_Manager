import {
  getTasks,
  saveTasks
} from "./storage.js";

import {
  generateId,
  isOverdue
} from "./utils.js";

import {
  renderTasks,
  updateStats,
  updateTaskCount
} from "./ui.js";

import {
  showToast
} from "./toast.js";

import {
  initTheme,
  toggleTheme
} from "./theme.js";

import {
  initDragAndDrop
} from "./dragDrop.js";

/* =====================================================
   DOM ELEMENTS
===================================================== */

const taskForm =
  document.getElementById("taskForm");

const taskInput =
  document.getElementById("taskInput");

const categoryInput =
  document.getElementById(
    "categoryInput"
  );

const dueDateInput =
  document.getElementById(
    "dueDateInput"
  );

const searchInput =
  document.getElementById(
    "searchInput"
  );

const clearSearchBtn =
  document.getElementById(
    "clearSearchBtn"
  );

const taskList =
  document.getElementById("taskList");

const themeBtn =
  document.getElementById("themeBtn");

const titleCount =
  document.getElementById("titleCount");

const filterButtons =
  document.querySelectorAll(
    ".filter-btn"
  );

const dragHint =
  document.getElementById("dragHint");

/* Edit modal */

const editModal =
  document.getElementById("editModal");

const editTaskForm =
  document.getElementById(
    "editTaskForm"
  );

const editTaskInput =
  document.getElementById(
    "editTaskInput"
  );

const editCategoryInput =
  document.getElementById(
    "editCategoryInput"
  );

const editPriorityInput =
  document.getElementById(
    "editPriorityInput"
  );

const editDueDateInput =
  document.getElementById(
    "editDueDateInput"
  );

const closeEditBtn =
  document.getElementById(
    "closeEditBtn"
  );

const cancelEditBtn =
  document.getElementById(
    "cancelEditBtn"
  );

/* =====================================================
   STATE
===================================================== */

let tasks = getTasks();

let currentFilter = "all";

let editingTaskId = null;

let sortableInstance = null;

/* =====================================================
   HELPERS
===================================================== */

function getSelectedPriority() {
  const selectedPriority =
    document.querySelector(
      'input[name="priority"]:checked'
    );

  return selectedPriority?.value ||
    "Medium";
}

function getSearchKeyword() {
  return searchInput.value
    .trim()
    .toLowerCase();
}

function getFilteredTasks() {
  const keyword =
    getSearchKeyword();

  return tasks.filter(task => {
    const title =
      String(task.title || "")
        .toLowerCase();

    const category =
      String(task.category || "")
        .toLowerCase();

    const priority =
      String(task.priority || "")
        .toLowerCase();

    const matchesSearch =
      !keyword ||
      title.includes(keyword) ||
      category.includes(keyword) ||
      priority.includes(keyword);

    let matchesFilter = true;

    if (currentFilter === "active") {
      matchesFilter =
        !task.completed;
    }

    if (
      currentFilter === "completed"
    ) {
      matchesFilter =
        task.completed;
    }

    if (currentFilter === "overdue") {
      matchesFilter =
        !task.completed &&
        isOverdue(task.dueDate);
    }

    return (
      matchesSearch &&
      matchesFilter
    );
  });
}

function updateDragState() {
  if (!sortableInstance) {
    return;
  }

  const shouldDisable =
    currentFilter !== "all" ||
    Boolean(getSearchKeyword()) ||
    tasks.length < 2;

  sortableInstance.option(
    "disabled",
    shouldDisable
  );

  dragHint.hidden =
    shouldDisable;
}

function render() {
  const filteredTasks =
    getFilteredTasks();

  renderTasks(
    filteredTasks,
    taskList,
    {
      hasSearchOrFilter:
        Boolean(getSearchKeyword()) ||
        currentFilter !== "all"
    }
  );

  updateStats(tasks);

  updateTaskCount(
    filteredTasks.length
  );

  updateDragState();
}

function saveAndRender() {
  const saved =
    saveTasks(tasks);

  if (!saved) {
    showToast(
      "Unable to save your changes",
      "error"
    );
  }

  render();
}

function resetCreateForm() {
  taskForm.reset();

  const mediumPriority =
    document.querySelector(
      'input[name="priority"][value="Medium"]'
    );

  if (mediumPriority) {
    mediumPriority.checked = true;
  }

  titleCount.textContent = "0/80";

  taskInput.focus();
}

/* =====================================================
   TASK OPERATIONS
===================================================== */

function createTask() {
  const title =
    taskInput.value.trim();

  if (!title) {
    showToast(
      "Please enter a task title",
      "error"
    );

    taskInput.focus();
    return;
  }

  if (title.length < 3) {
    showToast(
      "Task title needs at least 3 characters",
      "warning"
    );

    taskInput.focus();
    return;
  }

  const newTask = {
    id: generateId(),
    title,
    category:
      categoryInput.value,
    priority:
      getSelectedPriority(),
    dueDate:
      dueDateInput.value,
    completed: false,
    createdAt:
      new Date().toISOString()
  };

  tasks.unshift(newTask);

  saveAndRender();

  resetCreateForm();

  showToast(
    "Task added successfully",
    "success"
  );
}

function toggleTask(id) {
  tasks = tasks.map(task => {
    if (
      String(task.id) === String(id)
    ) {
      return {
        ...task,
        completed:
          !task.completed
      };
    }

    return task;
  });

  saveAndRender();

  showToast(
    "Task status updated",
    "success"
  );
}

function deleteTask(id) {
  const task =
    tasks.find(
      item =>
        String(item.id) === String(id)
    );

  if (!task) {
    return;
  }

  const shouldDelete =
    window.confirm(
      `Delete "${task.title}"?`
    );

  if (!shouldDelete) {
    return;
  }

  tasks = tasks.filter(
    item =>
      String(item.id) !== String(id)
  );

  saveAndRender();

  showToast(
    "Task deleted",
    "error"
  );
}

/* =====================================================
   EDIT MODAL
===================================================== */

function openEditModal(id) {
  const task =
    tasks.find(
      item =>
        String(item.id) === String(id)
    );

  if (!task) {
    return;
  }

  editingTaskId =
    String(task.id);

  editTaskInput.value =
    task.title;

  editCategoryInput.value =
    task.category;

  editPriorityInput.value =
    task.priority;

  editDueDateInput.value =
    task.dueDate || "";

  editModal.hidden = false;

  document.body.style.overflow =
    "hidden";

  window.setTimeout(() => {
    editTaskInput.focus();
    editTaskInput.select();
  }, 50);
}

function closeEditModal() {
  editModal.hidden = true;

  document.body.style.overflow = "";

  editingTaskId = null;

  editTaskForm.reset();
}

function saveEditedTask() {
  const updatedTitle =
    editTaskInput.value.trim();

  if (!updatedTitle) {
    showToast(
      "Task title cannot be empty",
      "error"
    );

    editTaskInput.focus();
    return;
  }

  if (updatedTitle.length < 3) {
    showToast(
      "Task title needs at least 3 characters",
      "warning"
    );

    editTaskInput.focus();
    return;
  }

  tasks = tasks.map(task => {
    if (
      String(task.id) ===
      String(editingTaskId)
    ) {
      return {
        ...task,
        title: updatedTitle,
        category:
          editCategoryInput.value,
        priority:
          editPriorityInput.value,
        dueDate:
          editDueDateInput.value
      };
    }

    return task;
  });

  saveAndRender();

  closeEditModal();

  showToast(
    "Task updated successfully",
    "success"
  );
}

/* =====================================================
   DRAG AND DROP
===================================================== */

function reorderTasks(orderedIds) {
  const taskMap = new Map(
    tasks.map(task => [
      String(task.id),
      task
    ])
  );

  const reorderedTasks =
    orderedIds
      .map(id =>
        taskMap.get(String(id))
      )
      .filter(Boolean);

  if (
    reorderedTasks.length !==
    tasks.length
  ) {
    return;
  }

  tasks = reorderedTasks;

  saveTasks(tasks);

  showToast(
    "Task order updated",
    "info"
  );
}

/* =====================================================
   PAGE INFORMATION
===================================================== */

function updatePageInformation() {
  const currentDate =
    document.getElementById(
      "currentDate"
    );

  const yearElement =
    document.getElementById("year");

  if (currentDate) {
    currentDate.textContent =
      new Date().toLocaleDateString(
        "en-IN",
        {
          weekday: "short",
          day: "numeric",
          month: "short"
        }
      );
  }

  if (yearElement) {
    yearElement.textContent =
      new Date().getFullYear();
  }
}

/* =====================================================
   EVENTS
===================================================== */

taskForm.addEventListener(
  "submit",
  event => {
    event.preventDefault();
    createTask();
  }
);

taskInput.addEventListener(
  "input",
  () => {
    titleCount.textContent =
      `${taskInput.value.length}/80`;
  }
);

searchInput.addEventListener(
  "input",
  () => {
    clearSearchBtn.hidden =
      !searchInput.value;

    render();
  }
);

clearSearchBtn.addEventListener(
  "click",
  () => {
    searchInput.value = "";

    clearSearchBtn.hidden = true;

    searchInput.focus();

    render();
  }
);

filterButtons.forEach(button => {
  button.addEventListener(
    "click",
    () => {
      filterButtons.forEach(item =>
        item.classList.remove(
          "active"
        )
      );

      button.classList.add(
        "active"
      );

      currentFilter =
        button.dataset.filter;

      render();
    }
  );
});

taskList.addEventListener(
  "click",
  event => {
    const actionButton =
      event.target.closest(
        "[data-action]"
      );

    if (!actionButton) {
      return;
    }

    const {
      action,
      id
    } = actionButton.dataset;

    if (action === "toggle") {
      toggleTask(id);
    }

    if (action === "edit") {
      openEditModal(id);
    }

    if (action === "delete") {
      deleteTask(id);
    }
  }
);

themeBtn.addEventListener(
  "click",
  () => {
    const theme =
      toggleTheme(themeBtn);

    showToast(
      theme === "dark"
        ? "Dark theme enabled"
        : "Light theme enabled",
      "info"
    );
  }
);

editTaskForm.addEventListener(
  "submit",
  event => {
    event.preventDefault();
    saveEditedTask();
  }
);

closeEditBtn.addEventListener(
  "click",
  closeEditModal
);

cancelEditBtn.addEventListener(
  "click",
  closeEditModal
);

editModal.addEventListener(
  "click",
  event => {
    if (event.target === editModal) {
      closeEditModal();
    }
  }
);

document.addEventListener(
  "keydown",
  event => {
    if (
      event.key === "Escape" &&
      !editModal.hidden
    ) {
      closeEditModal();
    }
  }
);

/* =====================================================
   INITIALIZATION
===================================================== */

initTheme(themeBtn);

updatePageInformation();

render();

sortableInstance =
  initDragAndDrop(
    taskList,
    reorderTasks
  );

updateDragState();