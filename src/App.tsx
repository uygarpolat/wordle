import { useContext } from "react";
import Line from "./Components/Line";
import Keyboard from "./Components/Keyboard";
import { KeyboardContext } from "./Store/keyboard-context";
import ProgressBar from "./Components/ProgressBar";
import Modal from "./Components/Modal";
import { Language } from "./Assets/Settings/Settings";
import Header from "./Components/Header";
import useSettings from "./Hooks/useSettings";
import useGameplay from "./Hooks/useGameplay";
import useInvalidFlash from "./Hooks/useInvalidFlash";
import useGuessHandling from "./Hooks/useGuessHandling";
import useProgressBar from "./Hooks/useProgressBar";
import useGameOver from "./Hooks/useGameOver";
import generateGuessWord from "./Utils/utils";

function App() {
  const {
    language,
    setLanguage,
    theme,
    toggleTheme,
    settings,
    isOver,
    setIsOver,
    speedMode,
    setSpeedMode,
  } = useSettings();

  const {
    currentGuessIndex,
    setCurrentGuessIndex,
    targetWord,
    setTargetWord,
    guesses,
    setGuesses,
    tileTags,
    setTileTags,
    handleGameOver,
  } = useGameplay(settings, setIsOver, speedMode);

  const { keyboardColors, resetKeyboardColors } = useContext(KeyboardContext);

  const { handleGameOverReset } = useGameOver(
    settings,
    setGuesses,
    setTileTags,
    setCurrentGuessIndex,
    setIsOver,
    resetKeyboardColors,
    setTargetWord
  );

  const { triggerInvalidFlash } = useInvalidFlash();

  const { submitGuess, handleKeyboardInput } = useGuessHandling(
    settings,
    targetWord,
    handleGameOver,
    handleGameOverReset,
    language,
    triggerInvalidFlash,
    setTileTags,
    currentGuessIndex,
    setCurrentGuessIndex,
    guesses,
    isOver,
    setGuesses
  );

  const { handleProgressBarTimeout } = useProgressBar(
    settings,
    keyboardColors,
    currentGuessIndex,
    setGuesses,
    submitGuess,
    generateGuessWord
  );

  function handleSpeedMode() {
    setSpeedMode((prev) => !prev);
    handleGameOverReset();
  }

  return (
    <div className="main">
      <Header
        handleLanguageChange={(language: Language) => setLanguage(language)}
        handleSpeedMode={handleSpeedMode}
        speedMode={speedMode}
        language={settings.language}
        toggleTheme={toggleTheme}
        theme={theme}
      />
      <h1 id="app-title">wordle</h1>
      <div id="board-and-keyboard">
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
              key={`${currentGuessIndex}-${language}`}
              isOver={isOver}
              duration={30 * 1000}
              onTimeout={handleProgressBarTimeout}
            />
          )}
          <Modal
            settings={settings}
            isOver={isOver}
            targetWord={targetWord}
            onPlayAgain={handleGameOverReset}
            tileTags={tileTags}
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
