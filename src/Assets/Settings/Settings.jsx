const BIG_FILE = "wordlist_big.txt";
const SMALL_FILE = "wordlist_small.txt";
const TOTAL_LINES = 6;
const WORD_LENGTH = 5;

const KEYBOARD_EN = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["⏎", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

const KEYBOARD_TR = [
  ["E", "R", "T", "Y", "U", "I", "O", "P", "Ğ", "Ü"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ş", "İ"],
  ["⏎", "Z", "C", "V", "B", "N", "M", "Ö", "Ç", "⌫"],
];

const KEYBOARD_FI = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Å"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ö", "Ä"],
  ["⏎", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

const KEYBOARD_ES = [
  ["A", "Á", "B", "C", "D", "E", "É", "F", "G", "H"],
  ["I", "Í", "J", "K", "L", "M", "N", "Ñ", "O", "Ó"],
  ["P", "Q", "R", "S", "T", "U", "Ú", "Ü", "V", "W"],
  ["⏎", "X", "Y", "Z", "⌫"],
];

const CAPITAL_LETTERS_ES = [
  "A",
  "Á",
  "B",
  "C",
  "D",
  "E",
  "É",
  "F",
  "G",
  "H",
  "I",
  "Í",
  "J",
  "K",
  "L",
  "M",
  "N",
  "Ñ",
  "O",
  "Ó",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "Ú",
  "Ü",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const CAPITAL_LETTERS_EN = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const CAPITAL_LETTERS_TR = [
  "A",
  "B",
  "C",
  "Ç",
  "D",
  "E",
  "F",
  "G",
  "Ğ",
  "H",
  "I",
  "İ",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "Ö",
  "P",
  "R",
  "S",
  "Ş",
  "T",
  "U",
  "Ü",
  "V",
  "Y",
  "Z",
];

const CAPITAL_LETTERS_FI = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "Å",
  "Ä",
  "Ö",
];

export const KEYBOARD_LAYOUTS = {
  en: KEYBOARD_EN,
  tr: KEYBOARD_TR,
  fi: KEYBOARD_FI,
  es: KEYBOARD_ES,
};

export const ALPHABET_ARRAYS = {
  en: CAPITAL_LETTERS_EN,
  tr: CAPITAL_LETTERS_TR,
  fi: CAPITAL_LETTERS_FI,
  es: CAPITAL_LETTERS_ES,
};

function resultScreen(language, isOver, targetWord, history, onPlayAgain) {
  let modalContent = null;
  if (language === "tr") {
    modalContent = (
      <div className="modal">
        <p>
          {isOver === "won" ? "Kazandınız!" : "Kaybettiniz!"} Kelime{" "}
          {isOver === "won" ? "gerçekten de " : ""}
          <strong>{targetWord}</strong> idi.
        </p>
        <p>
          Şu ana kadarki skorunuz: <strong>{history[0].won}/{history[0].played}</strong><br/>Seri:{" "}
          <strong>{history[0].streak}</strong><br/>En uzun seri: <strong>{history[0].longestStreak}</strong>
        </p>
        <button className="play-again-button" onClick={onPlayAgain}>
          YENİDEN OYNA
        </button>
      </div>
    );
  } else {
    modalContent = (
      <div className="modal">
        <p>
          you {isOver}! the word was {isOver === "won" ? "indeed " : ""}
          <strong>{targetWord}</strong>
        </p>
        <p>
          your score so far: <strong>{history[0].won}/{history[0].played}</strong><br/>streak:{" "}
          <strong>{history[0].streak}</strong><br/>longest streak: <strong>{history[0].longestStreak}</strong>
        </p>
        <button className="play-again-button" onClick={onPlayAgain}>
          Play again
        </button>
      </div>
    );
  }
  return modalContent;
}

const wordListFiles = import.meta.glob("../Languages/*/*.txt", {
  as: "raw",
  eager: true,
});

const DATA_CACHE = {};

function data(language = "en") {
  if (DATA_CACHE[language]) {
    return DATA_CACHE[language];
  }

  function makeAllowedKeySet(language) {
    const allowed = new Set(["enter", "backspace"]);

    for (const letter of ALPHABET_ARRAYS[language]) {
      if (letter === "⏎" || letter === "⌫") continue;
      allowed.add(letter.toLocaleLowerCase(language));
    }
    return allowed;
  }

  const allowedKeySet = makeAllowedKeySet(language);
  const alphabetLength = ALPHABET_ARRAYS[language].length;

  const big_file_path = `../Languages/${language}/${BIG_FILE}`;
  const small_file_path = `../Languages/${language}/${SMALL_FILE}`;

  const big_file_temp = wordListFiles[big_file_path];
  const small_file_temp = wordListFiles[small_file_path];

  const big_file_set = new Set(big_file_temp.split("\n"));
  const small_file_set = new Set(small_file_temp.split("\n"));

  const big_file = Array.from(big_file_set);
  const small_file = Array.from(small_file_set);

  const payload = {
    language,
    big_file,
    small_file,
    big_file_set,
    small_file_set,
    total_lines: TOTAL_LINES,
    word_length: WORD_LENGTH,
    keyboard: KEYBOARD_LAYOUTS[language],
    alphabetArray: ALPHABET_ARRAYS[language],
    alphabetLength,
    allowedKeySet,
    resultScreen,
  };

  DATA_CACHE[language] = payload;
  return payload;
}

export default data;
