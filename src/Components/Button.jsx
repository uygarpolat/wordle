import { useContext, useEffect, useRef, memo } from "react";
import { KeyboardContext } from "../Store/keyboard-context";

function Button({
  children,
  onClick,
  ariaLabel,
  settings,
  widthStyle,
}) {
  const { keyboardColors } = useContext(KeyboardContext);

  const alphabetArray = settings.alphabetArray;
  const index = alphabetArray.indexOf(children);
  const buttonColor = keyboardColors[index];

  const COLOR_MAP = {
    gray: "rgb(209, 184, 184)",
    green: "rgb(70, 180, 70)",
    yellow: "yellow",
  };

  const prevColorRef = useRef(buttonColor);
  const prevColor = prevColorRef.current;

  useEffect(() => {
    prevColorRef.current = buttonColor;
  }, [buttonColor]);

  const shouldAnimate =
    buttonColor !== prevColor &&
    (buttonColor === "green" || buttonColor === "yellow");

  return (
    <button
      type="button"
      className={`button button-${buttonColor} ${
        shouldAnimate ? "animate" : ""
      }`}
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        "--prev-color": COLOR_MAP[prevColor],
        "--next-color": COLOR_MAP[buttonColor],
        "--widthStyle": widthStyle,
      }}
    >
      {children}
    </button>
  );
}

export default memo(Button);
