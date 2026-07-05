export function formatDate(dateString) {
  if (!dateString) return "No Due Date";

  const options = {
    day: "numeric",
    month: "short",
    year: "numeric"
  };

  return new Date(dateString).toLocaleDateString(
    "en-IN",
    options
  );
}

export function generateId() {
  return Date.now();
}

export function isOverdue(dateString) {
  if (!dateString) return false;

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return (
    new Date(dateString) < today
  );
}