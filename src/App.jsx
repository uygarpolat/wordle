import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
  useRef,
} from "react";
import Line from "./Components/Line";
import Keyboard from "./Components/Keyboard";
import { KeyboardContext } from "./Store/keyboard-context";
import ProgressBar from "./Components/ProgressBar";
import wordlistGuesses from "./Assets/Languages/en/wordlist_guesses_en.txt?raw";
import wordlistAnswers from "./Assets/Languages/en/wordlist_answers_en.txt?raw";
// import wordlistGuesses from "./Assets/Languages/tr/wordlist_guesses_tr.txt?raw";
// import wordlistAnswers from "./Assets/Languages/tr/wordlist_guesses_tr.txt?raw";

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

function generateGuessWord(keyboardColors, poolArray) {
  const poolArrayLength = poolArray.length;
  let guessWordIndex = Math.floor(Math.random() * poolArrayLength);

  let returnableWord = "";

  while (!returnableWord) {
    let testWord = poolArray[guessWordIndex % poolArrayLength];
    returnableWord = testWord;
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (
        keyboardColors[testWord[i].charCodeAt(0) - "a".charCodeAt(0)] ===
        "dark-gray"
      ) {
        returnableWord = "";
        break;
      }
    }
    guessWordIndex++;
  }
  console.log(returnableWord);
  return returnableWord;
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

  const progressRef = useRef(null);

  const [currentGuessIndex, setCurrentGuessIndex] = useState(0);
  const [isOver, setIsOver] = useState("ongoing");

  function handleIsOver(result) {
    setIsOver(result);
    const history = JSON.parse(localStorage.getItem("history")) || [
      {
        won: 0,
        played: 0,
        streak: 0,
        longestStreak: 0,
        guessLocation: Array(TOTAL_LINES + 1).fill(0),
      },
    ];
    const payload = {
      date: new Date().toISOString(),
      word: targetWord,
      result: result,
      guesses: guesses,
      lastGuessIndex: currentGuessIndex + 1,
    };
    history[0].won += result === "won" ? 1 : 0;
    history[0].played++;
    history[0].streak = result === "won" ? history[0].streak + 1 : 0;
    history[0].longestStreak = Math.max(
      history[0].longestStreak,
      history[0].streak
    );
    history[0].guessLocation[
      (currentGuessIndex + 1 + (result === "won" ? 0 : 1)) % (TOTAL_LINES + 1)
    ] += 1;
    localStorage.setItem("history", JSON.stringify([...history, payload]));
  }

  const { keyboardColors, updateKeyboardColors } = useContext(KeyboardContext);

  const handleProgressBarTimeout = useCallback(() => {
    const generatedGuessWord = generateGuessWord(keyboardColors, poolArray);
    setGuesses((prev) => {
      const next = [...prev];
      next[currentGuessIndex] = generatedGuessWord;
      return next;
    });
    handleInputRef.current?.("enter");
  }, [currentGuessIndex, keyboardColors, poolArray]);

  const handleInput = useCallback(
    (rawKey) => {
      const key = rawKey.toLowerCase();

      if (!/^(?:[a-zçğıöşü]|backspace|enter)$/.test(key)) {
        return;
      }

      if (isOver !== "ongoing") {
        if (key === "enter") {
          window.removeEventListener("keydown", handleKeyDown);
          window.location.reload();
        }
        return;
      }

      if (key === "enter") {
        if (guesses[currentGuessIndex].length === WORD_LENGTH) {
          const guessIsValid = handleGuess(guesses[currentGuessIndex]);
          if (guessIsValid) {
            progressRef.current?.reset();
            const isCorrect = checkGuess(
              guesses[currentGuessIndex],
              targetWord
            );

            const newTileTags = getNewTileTags(
              guesses[currentGuessIndex],
              targetWord
            );

            updateKeyboardColors(guesses[currentGuessIndex], newTileTags);

            setTileTags((prev) => {
              const next = [...prev];
              next[currentGuessIndex] = newTileTags;
              return next;
            });

            setCurrentGuessIndex((prev) => prev + 1);

            if (isCorrect) {
              handleIsOver("won");
              return;
            }

            if (currentGuessIndex + 1 >= TOTAL_LINES) {
              handleIsOver("lost");
              return;
            }
          } else {
            const generatedGuessWord = generateGuessWord(
              keyboardColors,
              poolArray
            );
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
    },
    [guesses, currentGuessIndex, isOver, targetWord]
  );

  const handleInputRef = useRef(handleInput);
  useEffect(() => {
    handleInputRef.current = handleInput;
  }, [handleInput]);

  const handleKeyboardInput = useCallback((key) => {
    handleInputRef.current(key);
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      handleInput(event.key);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleInput]);

  let modalContent = null;

  if (isOver !== "ongoing") {
    const history = JSON.parse(localStorage.getItem("history"));

    modalContent = (
      <div className="modal">
        <p>
          you {isOver}! the word was {isOver === "won" ? "indeed " : ""}
          <strong>{targetWord}</strong>
        </p>
        <p>
          your score so far: {history[0].won} / {history[0].played} streak:{" "}
          {history[0].streak} longest streak: {history[0].longestStreak}
        </p>
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
    <>
      <header id="app-header">
        <h1 id="app-title">wordle</h1>
        {/* <button id="toggle-theme-button">Toggle theme</button> */}
      </header>
      <div id="main">
        <div className="board-container">
          {/* <ProgressBar
            ref={progressRef}
            timer={3000}
            onTimeout={handleProgressBarTimeout}
          /> */}
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
        <div className="keyboard-container">
          <Keyboard onKeyPress={handleKeyboardInput} />
        </div>
      </div>
    </>
  );
}

export default App;
