import LanguageDropdown from "./LanguageDropdown";

export default function Header({
  handleLanguageChange,
  handleSpeedMode,
  speedMode,
}) {
  return (
    <header id="app-header">
      {false && <LanguageDropdown onLanguageChange={handleLanguageChange} />}
      <h1 id="app-title">wordle</h1>
      <div className="header-toggle">
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
