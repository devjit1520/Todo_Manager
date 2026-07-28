const THEME_STORAGE_KEY = "taskBloomTheme";

function updateThemeButton(themeButton, theme) {
  if (!themeButton) return;

  const isDark = theme === "dark";

  themeButton.innerHTML = isDark
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';

  themeButton.setAttribute(
    "aria-label",
    isDark
      ? "Switch to light theme"
      : "Switch to dark theme"
  );

  themeButton.setAttribute(
    "aria-pressed",
    String(isDark)
  );
}

export function initTheme(themeButton) {
  const savedTheme =
    localStorage.getItem(THEME_STORAGE_KEY);

  const systemPrefersDark =
    window.matchMedia &&
    window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

  const theme =
    savedTheme ||
    (systemPrefersDark ? "dark" : "light");

  document.documentElement.setAttribute(
    "data-theme",
    theme
  );

  updateThemeButton(themeButton, theme);

  return theme;
}

export function toggleTheme(themeButton) {
  const currentTheme =
    document.documentElement.getAttribute(
      "data-theme"
    ) || "dark";

  const nextTheme =
    currentTheme === "dark"
      ? "light"
      : "dark";

  document.documentElement.setAttribute(
    "data-theme",
    nextTheme
  );

  localStorage.setItem(
    THEME_STORAGE_KEY,
    nextTheme
  );

  updateThemeButton(
    themeButton,
    nextTheme
  );

  return nextTheme;
}