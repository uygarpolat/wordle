import { useState, useMemo, useEffect } from "react";

import data, { Language } from "../Assets/Settings/Settings";

export default function useSettings() {
  const [language, setLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const settings = useMemo(() => data(language), [language]);
  const [isOver, setIsOver] = useState<string>("ongoing");
  const [speedMode, setSpeedMode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return {
    language,
    setLanguage,
    theme,
    toggleTheme,
    settings,
    isOver,
    setIsOver,
    speedMode,
    setSpeedMode,
  };
}
