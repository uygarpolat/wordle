import Button from "./Button.jsx";

const KEYBOARD_ROWS_ENGLISH_QWERTY_CAPS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["⏎", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

export default function Keyboard({ onKeyPress }) {
  const normalizeKey = (label) => {
    if (label === "⏎") return "enter";
    if (label === "⌫") return "backspace";
    return label.toLowerCase();
  };

  return (
    <div className="keyboard">
      {KEYBOARD_ROWS_ENGLISH_QWERTY_CAPS.map((row, rowIndex) => (
        <div className="keyboard-row" key={rowIndex}>
          {row.map((ltr, keyIndex) => (
            <Button
              key={`${rowIndex}-${keyIndex}`}
              onClick={() => onKeyPress?.(normalizeKey(ltr))}
              ariaLabel={
                ltr === "⏎"
                  ? "Enter key"
                  : ltr === "⌫"
                  ? "Backspace key"
                  : `${ltr} key`
              }
            >
              {ltr}
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
}
