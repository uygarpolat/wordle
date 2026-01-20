import LanguageDropdown from "./LanguageDropdown";
import TimerInfo from "./TimerInfo";

export default function Header({
  handleLanguageChange,
  handleSpeedMode,
  speedMode,
  language,
}) {
  return (
    <header id="app-header">
      <LanguageDropdown onLanguageChange={handleLanguageChange} />
      <h1 id="app-title">wordle</h1>
      <div className="header-toggle">
      <TimerInfo language={language} />
        <label className="switch">
          <input
            type="checkbox"
            checked={speedMode}
            onChange={handleSpeedMode}
          />
          <span className="slider round"></span>
        </label>
      </div>
    </header>
  );
}
