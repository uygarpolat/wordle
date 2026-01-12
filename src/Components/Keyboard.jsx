import { memo } from "react";
import Button from "./Button.jsx";

const KEYBOARD_ROWS_ENGLISH_QWERTY_CAPS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["⏎", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

const KEYBOARD_ROWS_TURKISH_QWERTY_CAPS = [
  ["E", "R", "T", "Y", "U", "I", "O", "P", "Ğ", "Ü"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ş", "İ"],
  ["⏎", "Z", "C", "V", "B", "N", "M", "Ö", "Ç", "⌫"],
];

function Keyboard({ onKeyPress }) {
  const normalizeKey = (label) => {
    if (label === "⏎") return "enter";
    if (label === "⌫") return "backspace";
    return label.toLowerCase();
  };

  const current_keyboard = KEYBOARD_ROWS_ENGLISH_QWERTY_CAPS;
//   const current_keyboard = KEYBOARD_ROWS_TURKISH_QWERTY_CAPS;

  return (
    <div className="keyboard">
      {current_keyboard.map((row, rowIndex) => (
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

export default memo(Keyboard);
