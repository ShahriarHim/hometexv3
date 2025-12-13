/**
 * Theme Switcher Hook
 *
 * This hook allows you to dynamically change the entire color palette
 * of your site by updating CSS variables.
 *
 * USAGE:
 * ```tsx
 * import { useTheme } from '@/hooks/useTheme';
 *
 * function MyComponent() {
 *   const { setTheme, theme } = useTheme();
 *
 *   return (
 *     <button onClick={() => setTheme('vibrant')}>
 *       Switch to Vibrant Theme
 *     </button>
 *   );
 * }
 * ```
 */

import { useEffect, useState } from "react";

export type ThemePreset = "default" | "vibrant" | "elegant" | "minimal";

interface ThemeColors {
  primary: string;
  "primary-hover": string;
  "primary-active": string;
  "primary-light": string;
  secondary: string;
  "secondary-hover": string;
  accent: string;
  "accent-hover": string;
  "accent-secondary": string;
  "accent-secondary-hover": string;
}

const themes: Record<ThemePreset, ThemeColors> = {
  default: {
    primary: "61 100% 50%", // Electric Yellow
    "primary-hover": "61 100% 45%",
    "primary-active": "61 100% 40%",
    "primary-light": "61 100% 88%",
    secondary: "215 45% 20%", // Deep Navy
    "secondary-hover": "215 45% 16%",
    accent: "155 65% 40%", // Emerald
    "accent-hover": "155 65% 35%",
    "accent-secondary": "20 95% 55%", // Burnt Orange
    "accent-secondary-hover": "20 95% 48%",
  },
  vibrant: {
    primary: "61 100% 55%", // Brighter Yellow
    "primary-hover": "61 100% 50%",
    "primary-active": "61 100% 45%",
    "primary-light": "61 100% 90%",
    secondary: "280 60% 45%", // Rich Purple
    "secondary-hover": "280 60% 40%",
    accent: "165 80% 45%", // Bright Teal
    "accent-hover": "165 80% 40%",
    "accent-secondary": "345 80% 55%", // Hot Pink
    "accent-secondary-hover": "345 80% 50%",
  },
  elegant: {
    primary: "45 90% 50%", // Gold
    "primary-hover": "45 90% 45%",
    "primary-active": "45 90% 40%",
    "primary-light": "45 90% 88%",
    secondary: "0 0% 15%", // Charcoal
    "secondary-hover": "0 0% 10%",
    accent: "150 40% 35%", // Forest Green
    "accent-hover": "150 40% 30%",
    "accent-secondary": "25 80% 50%", // Terracotta
    "accent-secondary-hover": "25 80% 45%",
  },
  minimal: {
    primary: "0 0% 9%", // Black
    "primary-hover": "0 0% 20%",
    "primary-active": "0 0% 30%",
    "primary-light": "0 0% 90%",
    secondary: "0 0% 96%", // Light Gray
    "secondary-hover": "0 0% 90%",
    accent: "0 0% 40%", // Medium Gray
    "accent-hover": "0 0% 30%",
    "accent-secondary": "61 100% 50%", // Yellow accent
    "accent-secondary-hover": "61 100% 45%",
  },
};

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<ThemePreset>("default");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme-preset") as ThemePreset;
    if (savedTheme && themes[savedTheme]) {
      const theme = themes[savedTheme];
      const root = document.documentElement;

      Object.entries(theme).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });

      setCurrentTheme(savedTheme);
    }
  }, []);

  const applyTheme = (themeName: ThemePreset) => {
    const theme = themes[themeName];
    const root = document.documentElement;

    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    setCurrentTheme(themeName);
    localStorage.setItem("theme-preset", themeName);
  };

  return {
    theme: currentTheme,
    setTheme: applyTheme,
    themes: Object.keys(themes) as ThemePreset[],
  };
}
