import { createContext, useState } from "react";
import { ALPHABET_ARRAYS } from "../Assets/Settings/Settings.jsx";

export const KeyboardContext = createContext({
  keyboardColors: [],
  updateKeyboardColors: () => {},
  resetKeyboardColors: () => {},
  setKeyboardLength: () => {},
  handleAlphabetArray: () => {},
});

export const KeyboardContextProvider = ({ children }) => {
  const [keyboardColors, setKeyboardColors] = useState(Array(26).fill("gray"));
  const [length, setLength] = useState(26);
  const [alphabetArray, setAlphabetArray] = useState(ALPHABET_ARRAYS["en"]);

  function setKeyboardLength(newLength) {
    if (newLength !== length) {
      setLength(newLength);
      setKeyboardColors(Array(newLength).fill("gray"));
    }
  }

  function handleAlphabetArray(lang) {
	setAlphabetArray(ALPHABET_ARRAYS[lang]);
  }

  function updateKeyboardColors(word, colorTags, language) {
    setKeyboardColors((prev) => {
      const next = [...prev];

      for (let i = 0; i < word.length; i++) {
        const character = word[i].toLocaleUpperCase(language);
        const index = alphabetArray.indexOf(character);

        if (colorTags[i] === "green") {
          next[index] = "green";
        } else if (colorTags[i] === "yellow" && next[index] !== "green") {
          next[index] = "yellow";
        } else if (colorTags[i] === "gray" && next[index] === "gray") {
          next[index] = "dark-gray";
        }
      }
      return next;
    });
  }

  function resetKeyboardColors() {
    setKeyboardColors(Array(length).fill("gray"));
  }

  const payload = {
    keyboardColors,
    updateKeyboardColors,
    resetKeyboardColors,
    setKeyboardLength,
    handleAlphabetArray,
  };

  return (
    <KeyboardContext.Provider value={payload}>
      {children}
    </KeyboardContext.Provider>
  );
};
