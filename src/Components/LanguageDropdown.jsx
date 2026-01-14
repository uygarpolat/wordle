export default function LanguageDropdown({ onLanguageChange }) {
  return (
    <div>
      <select onChange={(e) => onLanguageChange(e.target.value)}>
        <option value="en">English</option>
        <option value="tr">Türkçe</option>
      </select>
    </div>
  );
}
