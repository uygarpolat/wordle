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
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0);
  const [isOver, setIsOver] = useState(false);


  useEffect(() => {
    function handleKeyDown(event) {
      const key = event.key.toLowerCase();

      if (!/^(?:[a-z]|backspace|enter)$/.test(key)) {
        return;
      }

      if (key === "enter") {
        if (guesses[currentGuessIndex].length === WORD_LENGTH) {
          const guessIsValid = handleGuess(guesses[currentGuessIndex]);
		  if (guessIsValid) {
			console.log("Guess is valid");
			const isCorrect = checkGuess(guesses[currentGuessIndex], targetWord);
			if (isCorrect) {
				console.log("You won!");
				setIsOver(true);
			}
			setCurrentGuessIndex((prev) => prev + 1);
		  } else {
			console.log("Guess is invalid");
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

  if (currentGuessIndex >= TOTAL_LINES && !isOver) {
    return <div>You lost!</div>;
  }

  if (isOver) {
    return <div>You won!</div>;
  }

  return (
    <div>
      {guesses.map((guess, index) => (
        <Line key={index} word={guess} />
      ))}
    </div>
  );
}

export default App;
