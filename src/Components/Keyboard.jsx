import { memo } from "react";
import Button from "./Button.jsx";

function Keyboard({ onKeyPress, keyboardLayout, settings}) {
  const normalizeKey = (label) => {
    if (label === "⏎") return "enter";
    if (label === "⌫") return "backspace";
    return label;
  };

  const current_keyboard = keyboardLayout;

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
                  : '`${ltr} key`'
              }
			  settings={settings}
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
