import { useCallback, useEffect, useRef, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import { KeyboardContext } from "../Store/keyboard-context";
import { SettingsPayload, Language } from "../Assets/Settings/Settings";

function handleGuess(guessedWord: string, validGuessWords: Set<string>) {
  return validGuessWords.has(guessedWord.toLowerCase());
}

function checkGuess(guessedWord: string, targetWord: string) {
  return guessedWord === targetWord;
}

function getNewTileTags(
  guessedWord: string,
  targetWord: string,
  settings: SettingsPayload
) {
  const tileTags: string[] = Array(settings.word_length).fill("");
  const alphabetArray: number[] = Array(settings.alphabetLength).fill(0);

  for (let i = 0; i < settings.word_length; i++) {
    tileTags[i] = "gray";
    const character = targetWord[i].toLocaleUpperCase(settings.language);
    const index = settings.alphabetArray.indexOf(character);
    alphabetArray[index]++;
    if (guessedWord[i] === targetWord[i]) {
      tileTags[i] = "green";
      alphabetArray[index]--;
    }
  }
  for (let i = 0; i < settings.word_length; i++) {
    const character = guessedWord[i].toLocaleUpperCase(settings.language);
    const index = settings.alphabetArray.indexOf(character);
    if (guessedWord[i] !== targetWord[i] && alphabetArray[index] > 0) {
      tileTags[i] = "yellow";
      alphabetArray[index]--;
    }
  }
  return tileTags;
}

export default function useGuessHandling(
  settings: SettingsPayload,
  targetWord: string,
  handleGameOver: (
    result: string,
    guesses: string[],
    guessIndex: number
  ) => void,
  handleGameOverReset: () => void,
  language: Language,
  triggerInvalidFlash: () => void,
  setTileTags: Dispatch<SetStateAction<string[][]>>,
  currentGuessIndex: number,
  setCurrentGuessIndex: Dispatch<SetStateAction<number>>,
  guesses: string[],
  isOver: string,
  setGuesses: Dispatch<SetStateAction<string[]>>
) {
  const { updateKeyboardColors, setKeyboardLength, handleAlphabetArray } =
    useContext(KeyboardContext);

  useEffect(() => {
    setKeyboardLength(settings.alphabetLength);
  }, [settings.alphabetLength, setKeyboardLength]);

  useEffect(() => {
    handleAlphabetArray(settings.language);
  }, [handleAlphabetArray, settings.language]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    handleGameOverReset();
  }, [language]);

  const submitGuess = useCallback(
    (guessedWord: string) => {
      if (guessedWord.length !== settings.word_length) {
        triggerInvalidFlash();
        return;
      }

      const guessIsValid = handleGuess(guessedWord, settings.big_file_set);
      if (!guessIsValid) {
        triggerInvalidFlash();
        return;
      }

      const isCorrect = checkGuess(guessedWord, targetWord);

      const newTileTags = getNewTileTags(guessedWord, targetWord, settings);

      updateKeyboardColors(guessedWord, newTileTags, language);

      setTileTags((prev) => {
        const next = [...prev];
        next[currentGuessIndex] = newTileTags;
        return next;
      });

      setCurrentGuessIndex((prev) => prev + 1);

      if (isCorrect) {
        const nextGuesses = [...guesses];
        nextGuesses[currentGuessIndex] = guessedWord;
        handleGameOver("won", nextGuesses, currentGuessIndex);
        return;
      }

      if (currentGuessIndex + 1 >= settings.total_lines) {
        const nextGuesses = [...guesses];
        nextGuesses[currentGuessIndex] = guessedWord;
        handleGameOver("lost", nextGuesses, currentGuessIndex);
        return;
      }
    },
    [
      settings.big_file_set,
      currentGuessIndex,
      language,
      triggerInvalidFlash,
      settings,
      targetWord,
      settings.total_lines,
      updateKeyboardColors,
      settings.word_length,
    ]
  );

  const handleInput = useCallback(
    (rawKey: string) => {
      const key = rawKey.toLocaleLowerCase(settings.language);

      if (!settings.allowedKeySet.has(key)) {
        return;
      }

      if (isOver !== "ongoing") {
        if (key === "enter") {
          handleGameOverReset();
        }
        return;
      }

      if (key === "enter") {
        submitGuess(guesses[currentGuessIndex]);
        return;
      }

      if (key === "backspace") {
        setGuesses((prev) => {
          const next = [...prev];
          next[currentGuessIndex] = prev[currentGuessIndex].slice(0, -1);
          return next;
        });
        return;
      }

      if (guesses[currentGuessIndex].length >= settings.word_length) {
        return;
      }

      setGuesses((prev) => {
        const next = [...prev];
        next[currentGuessIndex] += key;
        return next;
      });
    },
    [guesses, currentGuessIndex, isOver, targetWord, submitGuess]
  );

  const handleInputRef = useRef(handleInput);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    handleInputRef.current = handleInput;
  }, [handleInput]);

  const handleKeyboardInput = useCallback((key: string) => {
    handleInputRef.current(key);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      handleInput(event.key);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleInput]);

  return { submitGuess, handleKeyboardInput };
}
