import { createContext, useState } from "react";

const KEYBOARD_COLORS = Array(26).fill("gray");

export const KeyboardContext = createContext({
  keyboardColors: [],
  updateKeyboardColors: () => {},
});

export const KeyboardContextProvider = ({ children }) => {
  const [keyboardColors, setKeyboardColors] = useState(KEYBOARD_COLORS);

  function updateKeyboardColors(word, colorTags) {
    setKeyboardColors((prev) => {
      const next = [...prev];

      for (let i = 0; i < word.length; i++) {
        if (colorTags[i] === "green") {
          next[word[i].charCodeAt(0) - "a".charCodeAt(0)] = "green";
        } else if (
          colorTags[i] === "yellow" &&
          next[word[i].charCodeAt(0) - "a".charCodeAt(0)] !== "green"
        ) {
          next[word[i].charCodeAt(0) - "a".charCodeAt(0)] = "yellow";
        }
      }
      return next;
    });
  }

  const payload = {
    keyboardColors,
    updateKeyboardColors,
  };

  return (
    <KeyboardContext.Provider value={payload}>
      {children}
    </KeyboardContext.Provider>
  );
};
