import { formatDate, isOverdue } from "./utils.js";

function getPriorityClass(priority) {
  switch (priority) {
    case "High":
      return "bg-red-500";

    case "Medium":
      return "bg-yellow-500";

    case "Low":
      return "bg-green-500";

    default:
      return "bg-slate-500";
  }
}

export function renderTasks(tasks, container) {
  container.innerHTML = "";

  if (!tasks.length) {
    container.innerHTML = `
    
      <div class="glass-card p-10 text-center">

        <img
          src="./src/assets/empty-state.svg"
          class="w-64 mx-auto mb-6"
          alt="Empty State">

        <h2 class="text-2xl font-bold mb-2">
          No Tasks Found
        </h2>

        <p class="text-slate-400">
          Start organizing your day 🚀
        </p>

      </div>
    
    `;

    return;
  }

  tasks.forEach(task => {
    const overdue =
      !task.completed &&
      isOverdue(task.dueDate);

    const card = document.createElement("div");

    card.className =
      `glass-card p-5 flex justify-between items-center transition-all duration-300
      ${overdue ? "border-red-500 border-2" : ""}`;

    card.innerHTML = `
    
      <div>

        <h3 class="
          text-xl font-semibold
          ${task.completed
            ? "line-through text-slate-500"
            : ""}
        ">
          ${task.title}
        </h3>

        <div class="flex gap-3 mt-3 flex-wrap">

          <span class="px-3 py-1 rounded-full bg-blue-600 text-sm">
            ${task.category}
          </span>

          <span class="px-3 py-1 rounded-full text-sm ${getPriorityClass(task.priority)}">
            ${task.priority}
          </span>

          <span class="text-sm text-slate-400">
            📅 ${formatDate(task.dueDate)}
          </span>

        </div>

      </div>

      <div class="flex gap-3">

        <button
          class="complete-btn bg-green-600 px-4 py-2 rounded-lg"
          data-id="${task.id}">

          ✓

        </button>

        <button
          class="edit-btn bg-yellow-500 px-4 py-2 rounded-lg"
          data-id="${task.id}">

          ✎

        </button>

        <button
          class="delete-btn bg-red-600 px-4 py-2 rounded-lg"
          data-id="${task.id}">

          ✕

        </button>

      </div>
    
    `;

    container.appendChild(card);
  });
}

export function updateStats(tasks) {
  const total = tasks.length;

  const completed =
    tasks.filter(task => task.completed)
    .length;

  const pending =
    total - completed;

  document.getElementById(
    "totalTasks"
  ).textContent = total;

  document.getElementById(
    "completedTasks"
  ).textContent = completed;

  document.getElementById(
    "pendingTasks"
  ).textContent = pending;
}