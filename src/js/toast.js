export function showToast(message, type = "success") {

  const colors = {
    success: "#22c55e",
    error: "#ef4444",
    info: "#3b82f6"
  };

  Toastify({
    text: message,

    duration: 2500,

    gravity: "top",

    position: "right",

    style: {
      background: colors[type]
    }

  }).showToast();
}