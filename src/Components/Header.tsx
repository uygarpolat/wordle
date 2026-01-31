import LanguageDropdown from "./LanguageDropdown";
import TimerInfo from "./TimerInfo";
import { Language } from "../Assets/Settings/Settings";

interface HeaderProps {
  handleLanguageChange: (lang: Language) => void;
  handleSpeedMode: () => void;
  speedMode: boolean;
  language: Language;
  toggleTheme: () => void;
  theme: "light" | "dark";
}

export default function Header({
  handleLanguageChange,
  handleSpeedMode,
  speedMode,
  language,
  toggleTheme,
  theme,
}: HeaderProps) {
  return (
    <>
      <header id="app-header">
        <LanguageDropdown onLanguageChange={handleLanguageChange} />
        <div className="header-trio">
          <TimerInfo language={language} />
          <button id="timer-toggle" onClick={handleSpeedMode}>
            {speedMode ? "💤" : "⏱️"}
          </button>
          <button id="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </header>
    </>
  );
}
