import LanguageDropdown from "./LanguageDropdown";
import TimerInfo from "./TimerInfo";
import { Language } from "../Assets/Settings/Settings";

interface HeaderProps {
	handleLanguageChange: (lang: Language) => void;
	handleSpeedMode: () => void;
	speedMode: boolean;
	language: Language;
}

export default function Header({
	handleLanguageChange,
	handleSpeedMode,
	speedMode,
	language,
}: HeaderProps) {
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
