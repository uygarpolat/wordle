import { Dispatch, SetStateAction, useCallback } from "react";
import { SettingsPayload } from "../Assets/Settings/Settings";

export default function useProgressBar(
  settings: SettingsPayload,
  keyboardColors: string[],
  currentGuessIndex: number,
  setGuesses: Dispatch<SetStateAction<string[]>>,
  submitGuess: (guess: string) => void,
  generateGuessWord: (
    keyboardColors: string[],
    settings: SettingsPayload,
    poolArray: string[],
    wordLength: number
  ) => string
) {
  const handleProgressBarTimeout = useCallback(() => {
    const generatedGuessWord = generateGuessWord(
      keyboardColors,
      settings,
      settings.big_file,
      settings.word_length
    );
    setGuesses((prev) => {
      const next = [...prev];
      next[currentGuessIndex] = generatedGuessWord;
      return next;
    });
    submitGuess(generatedGuessWord);
  }, [currentGuessIndex, keyboardColors, settings.big_file, submitGuess]);

  return { handleProgressBarTimeout };
}
