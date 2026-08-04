const KEY_BASE_URL = "ai_sql_base_url";
const KEY_THEME = "ai_sql_theme";

export const DEFAULT_BASE_URL = "https://ai-sql-rag-ek3b.onrender.com";

export function getBaseUrl(): string {
  if (typeof window === "undefined") return DEFAULT_BASE_URL;
  return localStorage.getItem(KEY_BASE_URL) || DEFAULT_BASE_URL;
}

export function setBaseUrl(url: string) {
  localStorage.setItem(KEY_BASE_URL, url);
}

export type Theme = "dark" | "light";

export function getTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem(KEY_THEME) as Theme) || "dark";
}

export function setTheme(theme: Theme) {
  localStorage.setItem(KEY_THEME, theme);
  applyTheme(theme);
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}
