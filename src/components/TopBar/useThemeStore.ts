import { create } from "zustand";

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'theme';

const getInitialTheme = (): Theme => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
};

/** Aplica el tema al <html>; las variables CSS --cr-* cambian según data-theme */
const applyTheme = (theme: Theme) => {
  document.documentElement.setAttribute('data-theme', theme);
};

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
}

const initialTheme = getInitialTheme();
applyTheme(initialTheme);

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: initialTheme,
  toggleTheme: () => {
    const theme: Theme = get().theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage no disponible (modo privado): solo dura la sesión
    }
    set({ theme });
  },
}));
