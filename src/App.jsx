import { useEffect, useMemo, useState } from "react";
import Line from "./Components/Line";
import wordlistGuesses from "./Assets/wordlist_guesses.txt?raw";
import wordlistAnswers from "./Assets/wordlist_answers.txt?raw";

const validGuessWords = new Set(wordlistGuesses.split("\n"));
const poolOfTargetWords = new Set(wordlistAnswers.split("\n"));

const TOTAL_LINES = 6;
const WORD_LENGTH = 5;

function handleGuess(guessedWord) {
  return validGuessWords.has(guessedWord.toLowerCase());
}

function checkGuess(guessedWord, targetWord) {
  return guessedWord === targetWord;
}

function getNewTileTags(guessedWord, targetWord) {
  const tileTags = Array.from({ length: WORD_LENGTH }, () => "");
  const alphabetArray = Array(26).fill(0);

  for (let i = 0; i < WORD_LENGTH; i++) {
    tileTags[i] = "gray";
    alphabetArray[targetWord[i].charCodeAt(0) - "a".charCodeAt(0)]++;
    if (guessedWord[i] === targetWord[i]) {
      tileTags[i] = "green";
      alphabetArray[targetWord[i].charCodeAt(0) - "a".charCodeAt(0)]--;
    }
  }
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (
      guessedWord[i] !== targetWord[i] &&
      alphabetArray[guessedWord[i].charCodeAt(0) - "a".charCodeAt(0)] > 0
    ) {
      tileTags[i] = "yellow";
      alphabetArray[guessedWord[i].charCodeAt(0) - "a".charCodeAt(0)]--;
    }
  }
  return tileTags;
}

function App() {
  const poolArray = useMemo(() => Array.from(poolOfTargetWords), []);
  const [targetWord] = useState(() => {
    const idx = Math.floor(Math.random() * poolArray.length);
    console.log("Target word:", poolArray[idx]);
    return poolArray[idx];
  });

  const [guesses, setGuesses] = useState(() =>
    Array.from({ length: TOTAL_LINES }, () => "")
  );

  const [tileTags, setTileTags] = useState(() =>
    Array.from({ length: TOTAL_LINES }, () =>
      Array.from({ length: WORD_LENGTH }, () => "")
    )
  );

  const [currentGuessIndex, setCurrentGuessIndex] = useState(0);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    function handleKeyDown(event) {
      const key = event.key.toLowerCase();

      if (!/^(?:[a-z]|backspace|enter)$/.test(key)) {
        return;
      }

      if (key === "enter") {

		if (isOver) {
			window.removeEventListener("keydown", handleKeyDown);
			window.location.reload();
			return
		}

        if (guesses[currentGuessIndex].length === WORD_LENGTH) {
          const guessIsValid = handleGuess(guesses[currentGuessIndex]);
          if (guessIsValid) {
            const isCorrect = checkGuess(
              guesses[currentGuessIndex],
              targetWord
            );

            const newTileTags = getNewTileTags(
              guesses[currentGuessIndex],
              targetWord
            );

            setTileTags((prev) => {
              const next = [...prev];
              next[currentGuessIndex] = newTileTags;
              return next;
            });

            if (isCorrect) {
              setIsOver(true);
            }

            setCurrentGuessIndex((prev) => prev + 1);
          }
        }
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

      if (guesses[currentGuessIndex].length >= WORD_LENGTH) {
        return;
      }

      setGuesses((prev) => {
        const next = [...prev];
        next[currentGuessIndex] += key;
        return next;
      });
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [guesses, currentGuessIndex]);

  let modalContent = null;

  if (currentGuessIndex >= TOTAL_LINES && !isOver) {
    modalContent = (
      <div className="modal">
        you lost! the word was <strong>{targetWord}</strong>
        <button
          className="play-again-button"
          onClick={() => window.location.reload()}
        >
          Play again
        </button>
      </div>
    );
  }
  if (isOver) {
    modalContent = (
      <div className="modal">
        you won! the word was indeed <strong>{targetWord}</strong>
        <button
          className="play-again-button"
          onClick={() => window.location.reload()}
        >
          Play again
        </button>
      </div>
    );
  }

  return (
    <div className="board-container">
      {guesses.map((guess, index) => (
        <Line
          key={index}
          word={guess}
          tags={tileTags[index]}
          isCurrentLine={currentGuessIndex - 1 === index}
        />
      ))}
      {modalContent}
    </div>
  );
}

export default App;
