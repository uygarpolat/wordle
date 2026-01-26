import { Language } from "../Assets/Settings/Settings";

interface LanguageDropdownProps {
	onLanguageChange: (lang: Language) => void;
}

export default function LanguageDropdown({
	onLanguageChange,
}: LanguageDropdownProps) {
	return (
		<div className="language-dropdown">
			<select
				onChange={(e) => onLanguageChange(e.target.value as Language)}
				defaultValue="en"
			>
				<option value="en">🇬🇧 English</option>
				<option value="tr">🇹🇷 Türkçe</option>
				<option value="fi">🇫🇮 Suomi</option>
				<option value="es">🇪🇸 Español</option>
			</select>
		</div>
	);
}
