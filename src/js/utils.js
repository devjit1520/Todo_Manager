// Generate unique ID
export function generateId() {
  if (
    typeof crypto !== "undefined" &&
    crypto.randomUUID
  ) {
    return crypto.randomUUID();
  }

  return (
    Date.now().toString() +
    Math.random().toString(16).slice(2)
  );
}

// Format Date
export function formatDate(dateString) {
  if (!dateString) return "No deadline";

  const date = new Date(dateString);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Today's date
export function getTodayDateString() {
  const today = new Date();

  return today.toISOString().split("T")[0];
}

// Overdue
export function isOverdue(dateString) {
  if (!dateString) return false;

  return dateString < getTodayDateString();
}

// Due Today
export function isDueToday(dateString) {
  if (!dateString) return false;

  return dateString === getTodayDateString();
}

// Escape HTML
export function escapeHTML(text = "") {
  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}

// Convert to CSS class
export function normalizeClassName(text = "") {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-");
}