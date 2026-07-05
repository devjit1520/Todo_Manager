import { getTasks, saveTasks } from "./storage.js";
import { initDragAndDrop } from "./dragDrop.js";
// render();

// initDragAndDrop(
//   taskList,
//   tasks,
//   render
// );

import {
  renderTasks,
  updateStats
} from "./ui.js";

import {
  showToast
} from "./toast.js";

import {
  initTheme,
  toggleTheme
} from "./theme.js";

import {
  generateId
} from "./utils.js";

/* ------------------ DOM ------------------ */

const taskInput =
  document.getElementById("taskInput");

const categoryInput =
  document.getElementById("categoryInput");

const priorityInput =
  document.getElementById("priorityInput");

const dueDateInput =
  document.getElementById("dueDateInput");

const addBtn =
  document.getElementById("addBtn");

const taskList =
  document.getElementById("taskList");

const searchInput =
  document.getElementById("searchInput");

const themeBtn =
  document.getElementById("themeBtn");

const filterButtons =
  document.querySelectorAll(".filter-btn");

/* ------------------ STATE ------------------ */

let tasks = getTasks();

let currentFilter = "all";

/* ------------------ INIT ------------------ */

initTheme();

render();

/* ------------------ FUNCTIONS ------------------ */

function render() {

  let filteredTasks = [...tasks];

  const keyword =
    searchInput.value
    .toLowerCase()
    .trim();

  if (keyword) {

    filteredTasks =
      filteredTasks.filter(task =>
        task.title
        .toLowerCase()
        .includes(keyword)
      );
  }

  if (currentFilter === "active") {

    filteredTasks =
      filteredTasks.filter(
        task => !task.completed
      );
  }

  if (currentFilter === "completed") {

    filteredTasks =
      filteredTasks.filter(
        task => task.completed
      );
  }

  renderTasks(
    filteredTasks,
    taskList
  );

  updateStats(tasks);
}

function createTask() {

  const title =
    taskInput.value.trim();

  if (!title) {

    showToast(
      "Task title is required",
      "error"
    );

    return;
  }

  const task = {

    id: generateId(),

    title,

    category:
      categoryInput.value,

    priority:
      priorityInput.value,

    dueDate:
      dueDateInput.value,

    completed: false,

    createdAt:
      new Date().toISOString()
  };

  tasks.unshift(task);

  saveTasks(tasks);

  showToast("Task Added");

  clearInputs();

  render();
}

function clearInputs() {

  taskInput.value = "";

  dueDateInput.value = "";
}

function deleteTask(id) {

  tasks =
    tasks.filter(
      task => task.id !== id
    );

  saveTasks(tasks);

  showToast(
    "Task Deleted",
    "error"
  );

  render();
}

function toggleComplete(id) {

  tasks =
    tasks.map(task => {

      if (task.id === id) {

        task.completed =
          !task.completed;
      }

      return task;
    });

  saveTasks(tasks);

  showToast(
    "Task Updated"
  );

  render();
}

const editModal =
  document.getElementById("editModal");

const editTaskInput =
  document.getElementById("editTaskInput");

const saveEditBtn =
  document.getElementById("saveEditBtn");

const cancelEditBtn =
  document.getElementById("cancelEditBtn");

let editingTaskId = null;

function openEditModal(id) {

  const task =
    tasks.find(
      t => t.id === id
    );

  if (!task) return;

  editingTaskId = id;

  editTaskInput.value =
    task.title;

  editModal.classList.remove(
    "hidden"
  );

  editModal.classList.add(
    "flex"
  );
}

saveEditBtn.onclick = () => {

  const task =
    tasks.find(
      t =>
        t.id === editingTaskId
    );

  if (!task) return;

  task.title =
    editTaskInput.value.trim();

  saveTasks(tasks);

  render();

  showToast(
    "Task Updated"
  );

  editModal.classList.add(
    "hidden"
  );
};

cancelEditBtn.onclick = () => {

  editModal.classList.add(
    "hidden"
  );
};

/* ------------------ EVENTS ------------------ */

addBtn.addEventListener(
  "click",
  createTask
);

taskInput.addEventListener(
  "keypress",
  e => {

    if (e.key === "Enter") {

      createTask();
    }
  }
);

searchInput.addEventListener(
  "input",
  render
);

themeBtn.addEventListener(
  "click",
  () => {

    const dark =
      toggleTheme();

    showToast(
      dark
        ? "Dark Mode Enabled"
        : "Light Mode Enabled",
      "info"
    );
  }
);

filterButtons.forEach(btn => {

  btn.addEventListener(
    "click",
    () => {

      filterButtons.forEach(
        b =>
          b.classList.remove(
            "active"
          )
      );

      btn.classList.add(
        "active"
      );

      currentFilter =
        btn.dataset.filter;

      render();
    }
  );
});

taskList.addEventListener(
  "click",
  e => {

    const id =
      Number(
        e.target.dataset.id
      );

    if (
      e.target.classList.contains(
        "delete-btn"
      )
    ) {

      deleteTask(id);
    }

    if (
      e.target.classList.contains(
        "complete-btn"
      )
    ) {

      toggleComplete(id);
    }

    if (
      e.target.classList.contains(
        "edit-btn"
      )
    ) {

      openEditModal(id);
    }
  }
);