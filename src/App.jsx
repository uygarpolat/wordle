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
import Modal from "./Components/Modal";
import data from "./Assets/Settings/Settings";
import Header from "./Components/Header";

function handleGuess(guessedWord, validGuessWords) {
  return validGuessWords.has(guessedWord.toLowerCase());
}

function checkGuess(guessedWord, targetWord) {
  return guessedWord === targetWord;
}

function getNewTileTags(guessedWord, targetWord, settings) {
  const tileTags = Array(settings.word_length).fill("");
  const alphabetArray = Array(settings.alphabetLength).fill(0);

  for (let i = 0; i < settings.word_length; i++) {
    tileTags[i] = "gray";
    const character = targetWord[i].toLocaleUpperCase();
    const index = settings.alphabetArray.indexOf(character);
    alphabetArray[index]++;
    if (guessedWord[i] === targetWord[i]) {
      tileTags[i] = "green";
      alphabetArray[index]--;
    }
  }
  for (let i = 0; i < settings.word_length; i++) {
    const character = guessedWord[i].toLocaleUpperCase();
    const index = settings.alphabetArray.indexOf(character);
    if (guessedWord[i] !== targetWord[i] && alphabetArray[index] > 0) {
      tileTags[i] = "yellow";
      alphabetArray[index]--;
    }
  }
  return tileTags;
}

function generateGuessWord(keyboardColors, poolArray, wordLength) {
  const poolArrayLength = poolArray.length;
  let guessWordIndex = Math.floor(Math.random() * poolArrayLength);

  let returnableWord = "";

  while (!returnableWord) {
    let testWord = poolArray[guessWordIndex % poolArrayLength];
    returnableWord = testWord;
    for (let i = 0; i < wordLength; i++) {
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
  return returnableWord;
}

function App() {
  const [language, setLanguage] = useState();

  const settings = useMemo(() => data(language), [language]);

  const [currentGuessIndex, setCurrentGuessIndex] = useState(0);
  const [isOver, setIsOver] = useState("ongoing");
  const [speedMode, setSpeedMode] = useState(false);

  const totalLines = settings.total_lines;
  const wordLength = settings.word_length;
  const big_file_set = settings.big_file_set;
  const big_file_array = settings.big_file;
  const small_file_array = settings.small_file;

  const [targetWord, setTargetWord] = useState(() => {
    const idx = Math.floor(Math.random() * small_file_array.length);
    console.log("Target word:", small_file_array[idx]);
    return small_file_array[idx];
  });

  const [guesses, setGuesses] = useState(() =>
    Array.from({ length: totalLines }, () => "")
  );

  const [tileTags, setTileTags] = useState(() =>
    Array.from({ length: totalLines }, () =>
      Array.from({ length: wordLength }, () => "")
    )
  );

  function handleLanguageChange(language) {
    setLanguage(language);
    const newSettings = data(language);
    handleGameOverReset(newSettings.small_file);
  }

  function handleGameOver(result) {
    setIsOver(result);
    const history = JSON.parse(localStorage.getItem("history")) || [
      {
        won: 0,
        played: 0,
        streak: 0,
        longestStreak: 0,
        guessLocation: Array(totalLines + 1).fill(0),
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
      (currentGuessIndex + 1 + (result === "won" ? 0 : 1)) % (totalLines + 1)
    ] += 1;
    localStorage.setItem("history", JSON.stringify([...history, payload]));
  }

  const {
    keyboardColors,
    updateKeyboardColors,
    resetKeyboardColors,
    setKeyboardLength,
    handleAlphabetArray,
  } = useContext(KeyboardContext);

  useEffect(() => {
    setKeyboardLength(settings.alphabetLength);
  }, [settings.alphabetLength, setKeyboardLength]);

  useEffect(() => {
    handleAlphabetArray(settings.language);
  }, [handleAlphabetArray, settings.language]);

  const submitGuess = useCallback(
    (guessedWord) => {
      if (guessedWord.length === wordLength) {
        const guessIsValid = handleGuess(guessedWord, big_file_set);
        if (guessIsValid) {
          const isCorrect = checkGuess(guessedWord, targetWord);

          const newTileTags = getNewTileTags(guessedWord, targetWord, settings);

          updateKeyboardColors(guessedWord, newTileTags);

          setTileTags((prev) => {
            const next = [...prev];
            next[currentGuessIndex] = newTileTags;
            return next;
          });

          setCurrentGuessIndex((prev) => prev + 1);

          if (isCorrect) {
            handleGameOver("won");
            return;
          }

          if (currentGuessIndex + 1 >= totalLines) {
            handleGameOver("lost");
            return;
          }
        }
      }
    },
    [currentGuessIndex, targetWord, updateKeyboardColors]
  );

  const handleInput = useCallback(
    (rawKey) => {
      const key = rawKey.toLocaleLowerCase(language);

      if (!/^(?:[a-zçğıöşü]|backspace|enter)$/.test(key)) {
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

      if (guesses[currentGuessIndex].length >= wordLength) {
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

  const handleProgressBarTimeout = useCallback(() => {
    const generatedGuessWord = generateGuessWord(
      keyboardColors,
      big_file_array,
      wordLength
    );
    setGuesses((prev) => {
      const next = [...prev];
      next[currentGuessIndex] = generatedGuessWord;
      return next;
    });
    submitGuess(generatedGuessWord);
  }, [currentGuessIndex, keyboardColors, big_file_array, submitGuess]);

  function handleGameOverReset(customSmallFileArray) {
    setGuesses(Array.from({ length: totalLines }, () => ""));
    setTileTags(
      Array.from({ length: totalLines }, () =>
        Array.from({ length: wordLength }, () => "")
      )
    );
    setCurrentGuessIndex(0);
    setIsOver("ongoing");
    resetKeyboardColors();

    const wordList = customSmallFileArray || small_file_array;
    const idx = Math.floor(Math.random() * wordList.length);
    console.log("Target word:", wordList[idx]);
    setTargetWord(wordList[idx]);
  }

  function handleSpeedMode() {
    setSpeedMode((prev) => !prev);
    handleGameOverReset();
  }

  return (
    <div className="board-area">
      <Header
        handleLanguageChange={handleLanguageChange}
        handleSpeedMode={handleSpeedMode}
        speedMode={speedMode}
      />
      <div id="main">
        <div className="board-container">
          {guesses.map((guess, index) => (
            <Line
              key={index}
              word={guess}
              tags={tileTags[index]}
              isCurrentLine={currentGuessIndex - 1 === index}
              language={language}
            />
          ))}
          {speedMode && (
            <ProgressBar
              key={currentGuessIndex}
              isOver={isOver}
              duration={15000}
              onTimeout={handleProgressBarTimeout}
            />
          )}
          <Modal
            isOver={isOver}
            targetWord={targetWord}
            onPlayAgain={handleGameOverReset}
          />
        </div>
        <div className="keyboard-container">
          <Keyboard
            onKeyPress={handleKeyboardInput}
            keyboardLayout={settings.keyboard}
            settings={settings}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
