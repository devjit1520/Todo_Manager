const THEME_KEY = "todoTheme";

export function initTheme() {

  const savedTheme =
    localStorage.getItem(THEME_KEY);

  if (savedTheme === "light") {

    document.body.classList.remove("dark");

  } else {

    document.body.classList.add("dark");
  }
}

export function toggleTheme() {

  document.body.classList.toggle("dark");

  const isDark =
    document.body.classList.contains("dark");

  localStorage.setItem(
    THEME_KEY,
    isDark ? "dark" : "light"
  );

  return isDark;
}