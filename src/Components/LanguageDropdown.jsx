export default function LanguageDropdown({ onLanguageChange }) {
  return (
    <div className="language-dropdown">
      <select onChange={(e) => onLanguageChange(e.target.value)}>
        <option value="en">🇬🇧 English</option>
        <option value="tr">🇹🇷 Türkçe</option>
        <option value="fi">🇫🇮 Suomi</option>
		<option value="es">🇪🇸 Español</option>
      </select>
    </div>
  );
}
