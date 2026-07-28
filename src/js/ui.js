import {
  escapeHTML,
  formatDate,
  isDueToday,
  isOverdue,
  normalizeClassName
} from "./utils.js";

function getDateStatus(task) {
  if (!task.dueDate) {
    return {
      className: "",
      label: "No deadline"
    };
  }

  if (
    !task.completed &&
    isOverdue(task.dueDate)
  ) {
    return {
      className: "overdue",
      label: `${formatDate(task.dueDate)} • Overdue`
    };
  }

  if (
    !task.completed &&
    isDueToday(task.dueDate)
  ) {
    return {
      className: "today",
      label: `${formatDate(task.dueDate)} • Today`
    };
  }

  return {
    className: "",
    label: formatDate(task.dueDate)
  };
}

function createTaskCard(task, index) {
  const article =
    document.createElement("article");

  const priorityClass =
    normalizeClassName(
      task.priority || "Medium"
    );

  const dateStatus =
    getDateStatus(task);

  const safeTitle =
    escapeHTML(task.title);

  const safeCategory =
    escapeHTML(task.category);

  const safePriority =
    escapeHTML(task.priority);

  article.className = `
    task-card
    task-priority-${priorityClass}
    ${task.completed
      ? "task-completed"
      : ""}
    ${
      !task.completed &&
      isOverdue(task.dueDate)
        ? "task-overdue"
        : ""
    }
  `;

  article.dataset.taskId =
    String(task.id);

  article.style.animationDelay =
    `${Math.min(index * 35, 210)}ms`;

  article.innerHTML = `
    <button
      class="task-check ${
        task.completed ? "checked" : ""
      }"
      type="button"
      data-action="toggle"
      data-id="${task.id}"
      aria-label="${
        task.completed
          ? "Mark task as active"
          : "Mark task as completed"
      }"
    >
      <i class="fa-solid fa-check"></i>
    </button>

    <div class="task-content">
      <h3 class="task-title">
        ${safeTitle}
      </h3>

      <div class="task-meta">
        <span class="task-badge task-category">
          <i class="fa-solid fa-folder"></i>
          ${safeCategory}
        </span>

        <span class="task-badge priority-${priorityClass}">
          <i class="fa-solid fa-signal"></i>
          ${safePriority}
        </span>

        <span class="task-date ${dateStatus.className}">
          <i class="fa-regular fa-calendar"></i>
          ${dateStatus.label}
        </span>
      </div>
    </div>

    <div class="task-actions">
      <button
        class="task-action edit-action"
        type="button"
        data-action="edit"
        data-id="${task.id}"
        aria-label="Edit task"
      >
        <i class="fa-solid fa-pen"></i>
      </button>

      <button
        class="task-action delete-action"
        type="button"
        data-action="delete"
        data-id="${task.id}"
        aria-label="Delete task"
      >
        <i class="fa-solid fa-trash"></i>
      </button>

      <button
        class="drag-handle"
        type="button"
        aria-label="Drag task"
      >
        <i class="fa-solid fa-grip-vertical"></i>
      </button>
    </div>
  `;

  return article;
}

function renderEmptyState(
  container,
  hasSearchOrFilter
) {
  container.innerHTML = `
    <div class="empty-state">
      <div>
<img
src="./src/assets/empty-state.svg"
  alt="No tasks illustration"
/>

        <h3>
          ${
            hasSearchOrFilter
              ? "No matching tasks"
              : "Your task list is ready"
          }
        </h3>

        <p>
          ${
            hasSearchOrFilter
              ? "Try changing the search text or selecting another filter."
              : "Create your first task and start building a more productive day."
          }
        </p>
      </div>
    </div>
  `;
}

export function renderTasks(
  tasks,
  container,
  options = {}
) {
  container.innerHTML = "";

  if (!tasks.length) {
    renderEmptyState(
      container,
      Boolean(options.hasSearchOrFilter)
    );

    return;
  }

  const fragment =
    document.createDocumentFragment();

  tasks.forEach((task, index) => {
    fragment.appendChild(
      createTaskCard(task, index)
    );
  });

  container.appendChild(fragment);
}

export function updateStats(tasks) {
  const total = tasks.length;

  const completed =
    tasks.filter(
      task => task.completed
    ).length;

  const pending =
    total - completed;

  const overdue =
    tasks.filter(
      task =>
        !task.completed &&
        isOverdue(task.dueDate)
    ).length;

  document.getElementById(
    "totalTasks"
  ).textContent = total;

  document.getElementById(
    "completedTasks"
  ).textContent = completed;

  document.getElementById(
    "pendingTasks"
  ).textContent = pending;

  document.getElementById(
    "overdueTasks"
  ).textContent = overdue;

  const focusMessage =
    document.getElementById("focusMessage");

  if (!focusMessage) {
    return;
  }

  if (total === 0) {
    focusMessage.textContent =
      "Start by adding your first task.";
  } else if (pending === 0) {
    focusMessage.textContent =
      "Excellent work. Everything is complete.";
  } else if (overdue > 0) {
    focusMessage.textContent =
      `${overdue} overdue ${
        overdue === 1 ? "task needs" : "tasks need"
      } attention.`;
  } else {
    focusMessage.textContent =
      `${pending} ${
        pending === 1 ? "task is" : "tasks are"
      } waiting for you.`;
  }
}

export function updateTaskCount(
  visibleCount
) {
  const resultElement =
    document.getElementById(
      "taskResultCount"
    );

  if (!resultElement) {
    return;
  }

  resultElement.textContent =
    `${visibleCount} ${
      visibleCount === 1
        ? "task"
        : "tasks"
    }`;
}