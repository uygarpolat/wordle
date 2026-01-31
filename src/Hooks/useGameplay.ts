import { useState, useCallback } from "react";

import { SettingsPayload, HistoryStats } from "../Assets/Settings/Settings";

export default function useGameplay(
  settings: SettingsPayload,
  setIsOver: (status: string) => void,
  speedMode: boolean
) {
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0);

  const [targetWord, setTargetWord] = useState(() => {
    const idx = Math.floor(Math.random() * settings.small_file.length);
    console.log("Target word:", settings.small_file[idx]);
    return settings.small_file[idx];
  });

  const [guesses, setGuesses] = useState<string[]>(() =>
    Array.from({ length: settings.total_lines }, () => "")
  );

  const [tileTags, setTileTags] = useState<string[][]>(() =>
    Array.from({ length: settings.total_lines }, () =>
      Array.from({ length: settings.word_length }, () => "")
    )
  );

  const handleGameOver = useCallback(
    (
      result: string,
      guessesSnapshot = guesses,
      guessIndex = currentGuessIndex
    ) => {
      setIsOver(result);
      const history: HistoryStats[] = JSON.parse(
        localStorage.getItem("history") || "[]"
      );
      if (history.length === 0) {
        history.push({
          won: 0,
          played: 0,
          streak: 0,
          longestStreak: 0,
          guessLocation: Array(settings.total_lines + 1).fill(0),
        });
      }
      const payload = {
        date: new Date().toISOString(),
        language: settings.language,
        speedMode,
        word: targetWord,
        result: result,
        guesses: guessesSnapshot,
        lastGuessIndex: guessIndex + 1,
      };
      history[0].won += result === "won" ? 1 : 0;
      history[0].played++;
      history[0].streak = result === "won" ? history[0].streak + 1 : 0;
      history[0].longestStreak = Math.max(
        history[0].longestStreak,
        history[0].streak
      );
      history[0].guessLocation[
        (guessIndex + 1 + (result === "won" ? 0 : 1)) %
          (settings.total_lines + 1)
      ] += 1;
      localStorage.setItem("history", JSON.stringify([...history, payload]));
    },
    [
      currentGuessIndex,
      guesses,
      setIsOver,
      settings.language,
      settings.total_lines,
      speedMode,
      targetWord,
    ]
  );

  return {
    currentGuessIndex,
    setCurrentGuessIndex,
    targetWord,
    setTargetWord,
    guesses,
    setGuesses,
    tileTags,
    setTileTags,
    handleGameOver,
  };
}
